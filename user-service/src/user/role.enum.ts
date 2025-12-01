// src/user/role.enum.ts
import { Role as PrismaRole } from '@prisma/client';
import { registerEnumType } from '@nestjs/graphql';

// ✅ Reuse Prisma's enum directly
export const Role = PrismaRole;
export type Role = PrismaRole;

// ✅ Register it with GraphQL
registerEnumType(Role, {
  name: 'Role',
});
