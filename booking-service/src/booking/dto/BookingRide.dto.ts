import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class BookRideDto {
  @Field()
  rideId: string;

  @Field()
  passengerId: string;

  @Field()
  destination: string;
}
