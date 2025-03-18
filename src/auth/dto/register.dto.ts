import { IsEmail, IsNotEmpty, MinLength, IsOptional } from '@nestjs/class-validator';

export class RegisterDto {
  @IsNotEmpty()
  lastName: string;

  @IsNotEmpty()
  firstName: string;

  @IsEmail()
  email: string;

  @MinLength(8)
  password: string;

  @IsOptional() // Rend le champ facultatif
  id_role?: string;

  @IsOptional()
  code_prof?: number;
}
