// src/user/dto/create-user.dto.ts
import { InputType, Field } from '@nestjs/graphql';
import { Role } from '../role.enum';

@InputType()
export class CreateUserDto {
  @Field()
  email: string;

  @Field()
  password: string;

  @Field()
  fullName: string;

  @Field(() => Role)
  role: Role;

  @Field()
  universityId: string;

}
