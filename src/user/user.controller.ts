import { Body, Controller, Post } from '@nestjs/common';
import { UserService } from '@/user/user.service';
import { CreateUserDto } from '@/user/dto/createUser.dto';

@Controller()
export class UserController {
  constructor(private userService: UserService) {}

  @Post('users')
  async createUser(@Body('user') createUserDto: CreateUserDto): Promise<any> {
    return this.userService.createUser(createUserDto);
  }
}
