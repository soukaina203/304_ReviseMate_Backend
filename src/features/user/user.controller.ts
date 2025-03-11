import { Body, Controller, Param, Patch, Logger } from '@nestjs/common';
import { UserService } from './user.service';
import { Update_userDto } from '../../auth/dto/update_user.dto';

@Controller('super/user')
export class UserController {
  constructor(private readonly userService: UserService) {}
  private readonly logger = new Logger(UserController.name);
  @Patch(':id')
  async update(@Param('id') id: string, @Body() data: Update_userDto) {
    const result = await this.userService.updateUser(id, data);

    if (result.user && result.user.password) {
      delete result.user.password;
    }

    return result;
  }
}
