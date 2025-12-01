import { Resolver, Mutation, Args, Query } from '@nestjs/graphql';
import { BookingService } from './booking.service';
import { Booking } from './booking.model';
import { BookRideDto } from './dto/BookingRide.dto';

@Resolver(() => Booking)
export class BookingResolver {
  constructor(private readonly bookingService: BookingService) {}

  @Mutation(() => Booking)
  async bookRide(@Args('data') data: BookRideDto): Promise<Booking> {
    return this.bookingService.bookRide(data.rideId, data.passengerId, data.destination);
  }

  @Mutation(() => String)
async cancelBooking(
  @Args('bookingId') bookingId: string,
  @Args('userId') userId: string
): Promise<string> {
  return this.bookingService.cancelBooking(bookingId, userId);
}

  @Query(() => [Booking])
  async allBookings(): Promise<Booking[]> {
    return this.bookingService.findAll();
  }

 /* @Mutation(() => String)
  async respondToBooking(
    @Args('bookingId') bookingId: string,
    @Args('driverId') driverId: string,
    @Args('action') action: 'ACCEPT' | 'REJECT',
  ): Promise<string> {
    return this.bookingService.respondToBooking(bookingId, driverId, action);
  }

*/
@Query(() => [Booking])
async PassengerRides(@Args('userId') userId: string): Promise<Booking[]> {
  return this.bookingService.PassengerSearchRides(userId);
}

@Query(() => [Booking])
async AdminViewsBookings(@Args('userId') userId: string): Promise<Booking[]> {
  return this.bookingService.AdminViewBookings(userId);
}


}