// kafka.config.ts
import { KafkaOptions, Transport } from '@nestjs/microservices';

export const kafkaConfig: KafkaOptions = {
  transport: Transport.KAFKA,
  options: {
    client: {
      brokers: ['localhost:9092'], // Adjust if using Docker
    },
    consumer: {
      groupId: 'ride-service-consumer', // change per service
    },
  },
};
