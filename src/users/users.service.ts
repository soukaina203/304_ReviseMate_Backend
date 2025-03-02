import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from '../schemas/user.schema';

// Add the @Injectable() decorator to the UsersService class. | Ajouter le décorateur @Injectable() à la classe UsersService.
@Injectable()

// Add the UsersService class. | Ajouter la classe UsersService.
export class UsersService {
  // Add the User model to the constructor. | Ajouter le modèle User au constructeur.
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  // Add the createUser() method to the UsersService class. | Ajouter la méthode createUser() à la classe UsersService.
  async createUser(
    firstName: string,
    lastName: string,
    email: string,
    password: string,
  ): Promise<User> {
    // Return a Promise<User> object. | Retourner un objet Promise<User>.
    const newUser = new this.userModel({
      firstName,
      lastName,
      email,
      password,
    });
    return newUser.save(); // Call the save() method on the newUser object. | Appeler la méthode save() sur l'objet newUser.
  }

  // Add the findAll() method to the UsersService class. | Ajouter la méthode findAll() à la classe UsersService.
  async findAll(): Promise<User[]> {
    // Call the find() method on the userModel object and then call the exec() method. | Appeler la méthode find() sur l'objet userModel puis appeler la méthode exec().
    return this.userModel.find().exec();
  }

  // Add the findOne() method to the UsersService class. | Ajouter la méthode findOne() à la classe UsersService.
  async findOne(email: string, password: string): Promise<User | null> {
    // Call the findOne() method on the userModel object and then call the exec() method. | Appeler la méthode findOne() sur l'objet userModel puis appeler la méthode exec().
    return this.userModel.findOne({ email, password }).exec();
  }

  // Add the deleteUserByEmail() method to the UsersService class. | Ajouter la méthode deleteUserByEmail() à la classe UsersService.
  async deleteUserByEmail(email: string): Promise<{ message: string }> {
    // Call the findOneAndDelete() method on the userModel object. | Appeler la méthode findOneAndDelete() sur l'objet userModel.
    const user = await this.userModel.findOneAndDelete({ email });
    if (!user) {
      // If the user is not found, throw an error. | Si l'utilisateur n'est pas trouvé, lancer une erreur.
      throw new Error('Utilisateur non trouvé');
    }
    // Return a success message. | Retourner un message de succès.
    return { message: 'Utilisateur supprimé' };
  }
}
