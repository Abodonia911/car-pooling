// src/user/user.resolver.ts
import { Resolver, Mutation, Args, Query } from '@nestjs/graphql';
import { UserService } from './user.service';
import { User } from './user.model';
import { CreateUserDto } from './dto/CreateUser.dto';
import { LoginResponse } from './dto/LoginResponse.dto';
import { LoginInput } from './dto/LoginUser.dto';
import { Role } from './role.enum'; // ✅ now synced with GraphQL


@Resolver(() => User)
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  @Mutation(() => User)
  async register(@Args('data') data: CreateUserDto) {
    return this.userService.createUser(data);
  }

  @Mutation(() => LoginResponse)
async login(@Args('data') data: LoginInput): Promise<LoginResponse> {
  const result = await this.userService.login(data.email, data.password);
  return {
    accessToken: result.accessToken,
    ...result.user,
  };}

  @Mutation(() => String)
async approveDriver(@Args('userId') userId: string): Promise<string> {
  return this.userService.approveDriver(userId);
}

@Mutation(() => String)
async RejectDriver(@Args('userId') userId: string): Promise<string> {
  return this.userService.RejectDriver(userId);
}


  @Query(() => User, { nullable: true })
  async getUserByEmail(@Args('email') email: string) {
    return this.userService.findByEmail(email);
  }

  @Query(() => [User])
  async getAllUsers() {
    return this.userService.findAll();
  }
}
