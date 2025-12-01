// src/ride/ride.service.ts
import { BadRequestException, ForbiddenException, Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { CreateRideDto } from 'src/dto/CreateRide.dto';
import { Prisma, PrismaClient, Ride } from '@prisma/client';

const prisma = new PrismaClient();

@Injectable()
export class RideService implements OnModuleInit {
  constructor(@Inject('KAFKA_SERVICE') private readonly kafkaClient: ClientKafka) {}

  async onModuleInit() {
    this.kafkaClient.subscribeToResponseOf('user.exists');
    await this.kafkaClient.connect();
  }

  async checkUserExists(userId: string): Promise<{ exists: boolean; role?: string }> {
    try {
      const res = await this.kafkaClient.send('user.exists', userId).toPromise();
      return res; // now it includes { exists, role }
    } catch (err) {
      console.error('Kafka Error:', err);
      return { exists: false };
    }
  }
  

  async createRide(data: CreateRideDto) {
    const origin = data.origin.trim().toLowerCase();
    const destination = data.destination.trim().toLowerCase();
  
    if (origin !== 'giu' && destination !== 'giu') {
      throw new BadRequestException('Ride must either start from or go to GIU.');
    }
  
    const user = await this.checkUserExists(data.driverId);
  
    if (!user.exists) {
      throw new BadRequestException('Driver does not exist');
    }
  
    if (user.role !== 'DRIVER') {
      throw new BadRequestException('Only drivers can create rides');
    }
  
    return prisma.ride.create({
      data: {
        ...data,
        origin: data.origin.toUpperCase(),
        destination: data.destination.toUpperCase(),
      },
    });
  }
  


  async validatePassenger(userId: string): Promise<void> {
    const user = await this.checkUserExists(userId);
  
    if (!user.exists) {
      throw new ForbiddenException('User not found');
    }
  
    if (user.role !== 'PASSENGER') {
      throw new ForbiddenException('Only passengers can perform this action');
    }
  }


 
  async searchRides(userId: string, origin?: string, destination?: string): Promise<Ride[]> {
    await this.validatePassenger(userId); // ✅ role check
  
    // ✅ Validate at least one of origin/destination is GIU
    const originLC = origin?.trim().toLowerCase();
    const destinationLC = destination?.trim().toLowerCase();
  
    if (originLC !== 'giu' && destinationLC !== 'giu') {
      throw new BadRequestException('You can only search for rides going to or from GIU.');
    }
  
    const filters: any = {};
    if (originLC) filters.origin = originLC.toUpperCase();
    if (destinationLC) filters.destination = destinationLC.toUpperCase();
  
    return prisma.ride.findMany({
      where: filters,
      orderBy: { date: 'asc' },
    });
  }

  async driverSearchRides(userId: string) {
    const driver = await this.checkUserExists(userId);
  
    if (!driver.exists) {
      throw new ForbiddenException('User not found');
    }
  
    if (driver.role !== 'DRIVER') {
      throw new ForbiddenException('Only drivers can view their rides');
    }
  
    return prisma.ride.findMany({
      where: {
        driverId: userId,
      },
      orderBy: {
        date: 'desc', // or 'asc' if you prefer
      },
    });


  }

  async AdminViewsRides(userId:string){
    const user = await this.checkUserExists(userId);
      
    if (!user.exists) {
      throw new ForbiddenException('User not found');
    }
  
    if (user.role !== 'ADMIN') {
      throw new ForbiddenException('Only ADMINS can view bookings');
    }

    return prisma.ride.findMany() 
  }
  
  }
  
