import { IsEmail, IsNotEmpty } from '@nestjs/class-validator';
//import { Schema as MongooseSchema } from 'mongoose';

export class LoginDto {
  @IsEmail()
  email: string;

  @IsNotEmpty()
  password: string;
}
