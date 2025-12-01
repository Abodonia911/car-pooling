// src/user/user.model.ts
import { ObjectType, Field, ID } from '@nestjs/graphql';
import { Role } from './role.enum';


@ObjectType()
export class User {
  @Field(() => ID)
  id: string;

  @Field()
  email: string;

  @Field()
  fullName: string;

  @Field()
  universityId: string;

  @Field(() => Role)
  role: Role;

  @Field()
  isEmailVerified: boolean;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}
