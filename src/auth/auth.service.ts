import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { User } from '../schemas/user.schema';
import { RegisterDto } from './dto/register.dto';

@Injectable()
export class AuthService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async register(registerDto: RegisterDto): Promise<User> {
    const { firstName, lastName, email, password } = registerDto;

    const existingUser = await this.userModel.findOne({ email }).exec();
    if (existingUser) {
      throw new BadRequestException(
        'Un compte existe déjà avec cette adresse mail.',
      );
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const newUser = new this.userModel({ firstName, lastName, email, hashedPassword });
    return newUser.save();
  }
}
