import { IsEmail, IsNotEmpty, MinLength } from '@nestjs/class-validator';

export class LoginDto {
    @IsNotEmpty() 
    email: string;

    @IsNotEmpty() 
    password: string;
  }
