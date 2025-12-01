// src/user/user.module.ts
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { UserService } from './user.service';
import { UserResolver } from './user.resolver';
import { Role } from './role.enum'; // ✅ now synced with GraphQL
import { UserKafkaController } from './user.controller';


@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'supersecret', // 🔐 load secret from env
      signOptions: { expiresIn: '1h' }, // ⏳ token expiry
    }),
  ],
  providers: [UserService, UserResolver],
  controllers:[UserKafkaController],
  exports: [UserService],
})
export class UserModule {}
