// kafka.config.ts
import { KafkaOptions, Transport } from '@nestjs/microservices';

export const kafkaConfig: KafkaOptions = {
  transport: Transport.KAFKA,
  options: {
    client: {
      brokers: ['localhost:9092'], // Adjust if using Docker
    },
    consumer: {
      groupId: 'consumer-service-ride', // change per service
    },
  },
};
