// src/ride/ride.module.ts
import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { RideService } from './ride.service';
import { RideResolver } from './ride.resolver';
import { RideKafkaController } from './ride.controller';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'KAFKA_SERVICE',
        transport: Transport.KAFKA,
        options: {
          client: {
            brokers: ['localhost:9092'],
          },
          consumer: {
            groupId: 'ride-service-consumer',
          },
        },
      },
    ]),
  ],
  providers: [RideService, RideResolver],
  controllers:[RideKafkaController]
})
export class RideModule {}
