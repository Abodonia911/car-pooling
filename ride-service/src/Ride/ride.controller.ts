// src/ride/ride.controller.ts
import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

@Controller()
export class RideKafkaController {
    @MessagePattern('ride.get')
    async handleRideGet(@Payload() rideId: string) {
      console.log('📥 ride.get received:', rideId);
      const ride = await prisma.ride.findUnique({ where: { id: rideId } });
    
      if (!ride) return null;
    
      return {
        id: ride.id,
        destination: ride.destination, // ✅ include this
        availableSeats: ride.availableSeats,
      };
    }
    

  @MessagePattern('ride.decreaseSeat')
async handleSeatDecrease(@Payload() rideId: string) {
  console.log('📉 ride.decreaseSeat received:', rideId);

  const ride = await prisma.ride.findUnique({ where: { id: rideId } });
  if (!ride || ride.availableSeats <= 0) {
    console.warn('❌ Cannot decrement seats: ride not found or no seats');
    return;
  }

  await prisma.ride.update({
    where: { id: rideId },
    data: {
      availableSeats: { decrement: 1 }, // 👈 Seat -1
    },
  });

  console.log('✅ Seat count decremented for ride:', rideId);
}

@MessagePattern('ride.increaseSeat')
async handleIncreaseSeat(@Payload() rideId: string) {
  console.log('📥 ride.increaseSeat received:', rideId);

  const ride = await prisma.ride.findUnique({ where: { id: rideId } });
  if (!ride) return;

  await prisma.ride.update({
    where: { id: rideId },
    data: {
      availableSeats: { increment: 1 },
    },
  });

  console.log('✅ Seat increased for ride:', rideId);
}

}
