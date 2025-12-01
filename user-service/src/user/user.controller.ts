/* src/user/user.controller.ts
import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { UserService } from './user.service';

@Controller()
export class UserKafkaController {
  constructor(private readonly userService: UserService) {}

  @MessagePattern('user.exists') // Kafka topic
  async handleUserExists(@Payload() userId: string) {
    const exists = await this.userService.userExists(userId);

    if(!exists){
        return {exists:false}
    }

    

}
}
*/
// src/user/user.controller.ts
import { Controller, NotFoundException } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { UserService } from './user.service';

@Controller()
export class UserKafkaController {
  constructor(private readonly userService: UserService) {}

  @MessagePattern('user.exists') // Kafka topic
  async handleUserExists(@Payload() userId: string) {
    const user = await this.userService.findById(userId);

    if (!user) {
      return { exists: false };
    }

    return {
      exists: true,
      role: user.role,
      isEmailVerified: user.isEmailVerified, // optional but useful
    };
  }
}



