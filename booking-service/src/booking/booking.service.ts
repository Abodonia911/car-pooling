import {
    Injectable,
    ForbiddenException,
    BadRequestException,
    Inject,
    OnModuleInit,
    NotFoundException,
  } from '@nestjs/common';
  import { PrismaClient } from '@prisma/client';
  import { ClientKafka } from '@nestjs/microservices';
  import { firstValueFrom, timeout } from 'rxjs';
//import { BookingStatus } from './booking.model';
  
  const prisma = new PrismaClient();
  
  @Injectable()
  export class BookingService implements OnModuleInit {
    constructor(
      @Inject('KAFKA_SERVICE') private readonly kafkaClient: ClientKafka
    ) {}
  
    async onModuleInit() {
      this.kafkaClient.subscribeToResponseOf('user.exists');
      this.kafkaClient.subscribeToResponseOf('ride.get');
      await this.kafkaClient.connect();
    }
  
    private async checkUserExists(userId: string): Promise<{ exists: boolean; role?: string }> {
      console.log('📨 Checking user.exists for:', userId);
      try {
        const res = await firstValueFrom(
          this.kafkaClient.send('user.exists', userId).pipe(timeout(5000))
        );
        console.log('✅ user.exists response:', res);
        return res;
      } catch (err) {
        console.error('❌ Kafka error (user.exists):', err);
        return { exists: false };
      }
    }
  
    private async validatePassenger(userId: string): Promise<void> {
      const user = await this.checkUserExists(userId);
  
      if (!user.exists) {
        throw new ForbiddenException('User not found');
      }
  
      if (user.role !== 'PASSENGER') {
        throw new ForbiddenException('Only passengers can book rides');
      }
    }
  
    async bookRide(rideId: string, passengerId: string, destination: string) {
        console.log('➡️ Booking ride:', { rideId, passengerId, destination });
      
        // ✅ Validate passenger role
        await this.validatePassenger(passengerId);
      
        // ✅ Fetch ride from ride-service
        console.log('📨 Checking ride.get for:', rideId);
        let ride;
        try {
          ride = await firstValueFrom(
            this.kafkaClient.send('ride.get', rideId).pipe(timeout(5000))
          );
          console.log('✅ ride.get response:', ride);
        } catch (err) {
          console.error('❌ Kafka error (ride.get):', err);
          throw new BadRequestException('Ride not found or service unavailable.');
        }
      
        if (!ride || ride.availableSeats <= 0) {
          throw new BadRequestException('No available seats for this ride.');
        }
      
        // ✅ Check if passenger's destination matches ride's destination
        if (ride.destination.toLowerCase() !== destination.trim().toLowerCase()) {
          throw new BadRequestException(`Destination mismatch. This ride goes to ${ride.destination}`);
        }
      
        // ✅ Create booking
        const booking = await prisma.booking.create({
          data: {
            rideId,
            passengerId,
            destination,
          },
        });
      
        // ✅ Decrease available seats
        await this.kafkaClient.emit('ride.decreaseSeat', rideId);
        await this.kafkaClient.emit('ride.booked', {
          rideId,
          passengerId,
          destination,
        });
      
        console.log('✅ Booking complete.');
        return booking;
      }




      async cancelBooking(bookingId: string, userId: string): Promise<string> {
        const booking = await prisma.booking.findUnique({ where: { id: bookingId } });
    
        if (!booking) throw new NotFoundException('Booking not found');
    
        if (booking.passengerId !== userId) {
          throw new ForbiddenException('You can only cancel your own bookings');
        }
    
        const now = new Date();
        const createdAt = new Date(booking.createdAt);
        const deadline = new Date(createdAt.getTime() + 3 * 60000); // 3 minutes
    
        if (now > deadline) {
          throw new ForbiddenException('Cancellation window expired (3 minutes)');
        }
    
        await prisma.booking.delete({ where: { id: bookingId } });
    
        await this.kafkaClient.emit('ride.increaseSeat', booking.rideId);
    
        return 'Booking cancelled and seat restored';
      }

      /*async respondToBooking(bookingId: string, driverId: string, action: 'ACCEPT' | 'REJECT') {
        const booking = await prisma.booking.findUnique({
          where: { id: bookingId },
          include: { ride: true },
        });
    
        if (!booking) throw new NotFoundException('Booking not found');
        if (booking.ride.driverId !== driverId)
          throw new ForbiddenException('Only the driver can respond');
    
        if (booking.status !== 'PENDING') {
          throw new BadRequestException('Booking already responded to');
        }
    
        const newStatus: BookingStatus = action === 'ACCEPT' ? 'ACCEPTED' : 'REJECTED';
    
        await prisma.booking.update({
          where: { id: bookingId },
          data: { status: newStatus },
        });
    
        return `Booking ${newStatus.toLowerCase()} successfully.`;
      }
      */
    async findAll() {
      return prisma.booking.findMany();
    }


    async PassengerSearchRides(userId: string) {
        const user = await this.checkUserExists(userId);
      
        if (!user.exists) {
          throw new ForbiddenException('User not found');
        }
      
        if (user.role !== 'PASSENGER') {
          throw new ForbiddenException('Only drivers can view their rides');
        }
      
        return prisma.booking.findMany({
          where: {
            passengerId: userId,
          },
          orderBy: {
            createdAt: 'desc', // or 'asc' if you prefer
          },
        });
      }

      async AdminViewBookings(userId:string){
        const user = await this.checkUserExists(userId);
      
        if (!user.exists) {
          throw new ForbiddenException('User not found');
        }
      
        if (user.role !== 'ADMIN') {
          throw new ForbiddenException('Only ADMINS can view bookings');
        }

        return prisma.booking.findMany() 
      }
      
  }
  