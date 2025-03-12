import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from '../../schemas/user.schema';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { Update_userDto } from '../../auth/dto/update_user.dto';

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);

  constructor(@InjectModel(User.name) private readonly userModel: Model<User>) {}

  async update(id: string, updateUserDto: Update_userDto): Promise<User> {
    this.logger.log(`Mise à jour de l'utilisateur avec l'ID : ${id}`);

    const cleanId = id.trim();

    //Vérifie si l'utilisateur existe | Check if the user exists
    const user = await this.userModel.findById(cleanId);
    if (!user) {
      throw new NotFoundException(`Utilisateur avec l'ID ${cleanId} non trouvé.`);
    }

    //Si un mot de passe est fourni, on le hash | If a password is provided, hash it
    if (updateUserDto.password) {
      this.logger.log('Hashage du mot de passe...');
      updateUserDto.password = await bcrypt.hash(updateUserDto.password, 10);
    }

    //Mise à jour de l'utilisateur | Update the user
    await this.userModel.findByIdAndUpdate(cleanId, updateUserDto, { new: true });

    //Retourne l'utilisateur mis à jour | Return the updated user
    return this.userModel.findById(cleanId);
  }
}
