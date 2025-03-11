import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from '../../schemas/user.schema';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(@InjectModel('User') private readonly userModel: Model<User>) {}

  async updateUser(id: string, data: User): Promise<{ message: string }> {
    if (data.password) {
      const salt = await bcrypt.genSalt(12);
      data.password = await bcrypt.hash(data.password, salt);
    }

    const updatedUser = await this.userModel
      .findByIdAndUpdate(id, data, {
        new: true,
      })
      .exec();

    if (!updatedUser) {
      throw new NotFoundException('Utilisateur introuvable!');
    }

    return { message: 'Utilisateur mis à jour!' };
  }
}
