// dto/login.response.ts
import { ObjectType, Field } from '@nestjs/graphql';
import { Role } from '../role.enum';

@ObjectType()
export class LoginResponse {
  @Field()
  accessToken: string;

  @Field()
  email: string;

  @Field()
  fullName: string;

  @Field(() => Role)
  role: Role;
}
