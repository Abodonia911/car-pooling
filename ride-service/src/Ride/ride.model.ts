import { ObjectType, Field, ID } from '@nestjs/graphql';

@ObjectType()
export class Ride {
  @Field(() => ID)
  id: string;

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

  @Field()
  createdAt: Date;
}
