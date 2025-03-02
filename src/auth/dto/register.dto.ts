import { IsEmail, IsNotEmpty, MinLength } from '@nestjs/class-validator';

// Add the RegisterDto class. | Ajouter la classe RegisterDto.
export class RegisterDto {
  @IsNotEmpty() // Pour vérifier que le champs 'lastName' n'est pas vide. | To check that the field 'lastName' is not empty.
  lastName: string;

  @IsNotEmpty() // Pour vérifier que le champs 'firstName' n'est pas vide. | To check that the field 'firstName' is not empty.
  firstName: string;

  @IsEmail() // Pour vérifier que l'adresse email est valide. | To check that the email address is valid.
  email: string;

  @MinLength(8) // Pour vérifier que le mot de passe a une longueur minimale de 8 caractères. | To check that the password has a minimum length of 8 characters.
  password: string;
}
