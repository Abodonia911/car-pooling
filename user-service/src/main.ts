// src/main.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Attach Kafka microservice
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.KAFKA,
    options: {
      client: {
        brokers: ['localhost:9092'], // or your Kafka broker address
      },
      consumer: {
        groupId: 'user-service-consumer',
      },
    },
  });

  await app.startAllMicroservices(); // Starts Kafka listener
  await app.listen(3001); // GraphQL still works here
}
bootstrap();
