// src/ride/ride.resolver.ts
import { Resolver, Query, Args, Mutation } from '@nestjs/graphql';
import { RideService } from './ride.service';
import { Ride } from './ride.model';
import { CreateRideDto } from 'src/dto/CreateRide.dto';

@Resolver()
export class RideResolver {
  constructor(private readonly rideService: RideService) {}

  @Query(() => String)
  async SearchUser(@Args('userId') userId: string): Promise<string> {
    const exists = await this.rideService.checkUserExists(userId);

    if (!exists) {
      throw new Error('User does not exist');
    }

    // Proceed to search ride logic
    return 'search successful for user: ' + userId;

  }

  @Mutation(() => Ride)
  async createRide(@Args('data') data: CreateRideDto): Promise<Ride> {
    return this.rideService.createRide(data);
  }


  @Query(() => [Ride])
  async searchRides(
    @Args('userId') userId: string,
    @Args('origin', { nullable: true }) origin?: string,
    @Args('destination', { nullable: true }) destination?: string,
  ): Promise<Ride[]> {
    return this.rideService.searchRides(userId, origin, destination);
  }

//DRIVER SEARCH FOR HIS RIDES
  @Query(() => [Ride])
async driverRides(@Args('userId') userId: string): Promise<Ride[]> {
  return this.rideService.driverSearchRides(userId);
}

//Admin views rides

@Query(() => [Ride])
async AdminViewsBookings(@Args('userId') userId: string): Promise<Ride[]> {
  return this.rideService.AdminViewsRides(userId);
}



}
