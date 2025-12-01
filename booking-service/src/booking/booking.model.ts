import { ObjectType, Field, ID, registerEnumType } from '@nestjs/graphql';

/*export enum BookingStatus {
  PENDING = 'PENDING',
  ACCEPTED = 'ACCEPTED',
  REJECTED = 'REJECTED',
}

registerEnumType(BookingStatus, {
  name: 'BookingStatus',
});
*/
@ObjectType()
export class Booking {
  @Field(() => ID)
  id: string;

  @Field()
  rideId: string;

  @Field()
  passengerId: string;

  @Field()
  destination: string;

  @Field()
  createdAt: Date;
}
