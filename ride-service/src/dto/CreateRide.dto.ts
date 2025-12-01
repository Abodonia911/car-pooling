import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class CreateRideDto {
  @Field()
  driverId: string;

  @Field()
  origin: string;

  @Field()
  destination: string;

  @Field()
  date: Date;

  @Field()
  availableSeats: number;
}
