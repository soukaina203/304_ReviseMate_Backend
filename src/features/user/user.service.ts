import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from '../../schemas/user.schema';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { Update_userDto } from '../../auth/dto/update_user.dto';

@Injectable()
export class UserService {
  constructor(@InjectModel('User') private readonly userModel: Model<User>) {}

  private readonly logger = new Logger(UserService.name);

  async updateUser(
    id: string,
    data: Update_userDto,
  ): Promise<{ message: string; user: any }> {
    const user = await this.userModel.findById(id).exec();

    if (!user) {
      throw new NotFoundException('Utilisateur introuvable!');
    }

    if (data.firstName !== undefined) user.firstName = data.firstName;
    if (data.lastName !== undefined) user.lastName = data.lastName;
    if (data.email !== undefined) user.email = data.email;

    if (data.password && data.password.trim() !== '') {
      const salt = await bcrypt.genSalt(12);
      user.password = await bcrypt.hash(data.password, salt);
    }

    const updatedUser = await user.save();

    const userObj = updatedUser.toObject();
    delete userObj.password;

    return {
      message: 'Utilisateur mis à jour!',
      user: userObj,
    };
  }
}
