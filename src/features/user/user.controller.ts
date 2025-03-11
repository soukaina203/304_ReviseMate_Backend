import { Controller, Put, Param, Body } from '@nestjs/common';
import { UserService } from './user.service';
import { Update_userDto } from '../../auth/dto/update_user.dto';
import { User } from '../../schemas/user.schema';

@Controller('super/user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  // Update a user | Mettre à jour un utilisateur
  @Put(':id')
  async update(@Param('id') id: string, @Body() updateUserDto: Update_userDto): Promise<User> {
    return this.userService.update(id, updateUserDto);
  }
}
