import { Module } from '@nestjs/common';
import { BookingResolver } from './booking.resolver';
import { BookingService } from './booking.service';
import { ClientsModule, Transport } from '@nestjs/microservices';


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
                groupId: 'booking-service-consumer',
              },
            },
          },
        ]),
      ],
  providers: [BookingResolver, BookingService],
})
export class BookingModule {}
