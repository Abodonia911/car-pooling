import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaClient, Role } from '@prisma/client';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { CreateUserDto } from './dto/CreateUser.dto';

const prisma = new PrismaClient();

@Injectable()
export class UserService {

  constructor(private jwtService: JwtService) {}


  async createUser(createUserDto: CreateUserDto) {
    const { email, password, role, ...rest } = createUserDto;
  
    // ✅ Rule 1: Email must end with @student.giu-uni.de
    if (!email.endsWith('@student.giu-uni.de') && role === "PASSENGER") {
      throw new BadRequestException('Only GIU student emails are allowed (e.g. mo@student.giu-uni.de)');
    }
  
    // ✅ Rule 2: Role must be DRIVER or PASSENGER
    if (role !== Role.DRIVER && role !== Role.PASSENGER) {
      throw new BadRequestException('Only DRIVER or PASSENGER roles can register');
    }
  
    // ✅ Rule 3: Email must be unique
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }
  
    // ✅ Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
  
    // ✅ Set approval only for drivers
    const isApproved = role === Role.DRIVER ? false : null;
  
    return prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        role,
        isEmailVerified: false,
        isApproved,
        ...rest, // fullName, universityId
      },
    });
  }

  async login(email: string, password: string) {
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (!existingUser) throw new Error('User not found');

    const isPasswordValid = await bcrypt.compare(password, existingUser.password);
    if (!isPasswordValid) throw new Error('Invalid password');

    const token = this.jwtService.sign({
      sub: existingUser.id,
      email: existingUser.email,
      role: existingUser.role,
    });

    return {
        accessToken: token,
        user: {
          email: existingUser.email,
          fullName: existingUser.fullName,
          role: existingUser.role as Role, // ✅ CAST IT to fix TS mismatch
        },
      };
  }



  // approve driver
  async approveDriver(userId: string): Promise<string> {

    const ExistingDriver = await prisma.user.findUnique({ where: { id: userId } })

    if(!ExistingDriver){
        throw new NotFoundException('Driver not found');

    }


    if (ExistingDriver.role !== Role.DRIVER) {
        throw new BadRequestException('Driver is not a driver');
      }

    await prisma.user.update({
        where : {id:userId},
        data: { isApproved: true },

    })

    return 'Driver approved successfully';
}

  
// reject driver 

async RejectDriver(userId:string): Promise<string> {

const ExistingDriver = await prisma.user.findUnique({where : {id:userId}})

if(!ExistingDriver){

    throw new NotFoundException('Driver not found');
}


if (ExistingDriver.role !== Role.DRIVER) {
    throw new BadRequestException('Driver is not a driver');
  }

await prisma.user.delete({where : {id : userId}})

 return "Driver rejected"
}

//async userExists(userId: string): Promise<boolean> {
  //  const user = await prisma.user.findUnique({ where: { id: userId } });
    //return !!user;
  //}


  async findById(id: string) {
    return prisma.user.findUnique({ where: { id } });
  }
  
  async findByEmail(email: string) {
    return prisma.user.findUnique({ where: { email } });
  }

  async findAll() {
    return prisma.user.findMany();
  }
}
