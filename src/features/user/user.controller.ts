import { Body, Controller, Param, Patch } from '@nestjs/common';
import { UserService } from './user.service';
//import { SuperController } from '../../super/super.controller';
import { User } from '../../schemas/user.schema';

@Controller('super/user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() data: User,
  ): Promise<{ message: string }> {
    return this.userService.updateUser(id, data);
  }
}
