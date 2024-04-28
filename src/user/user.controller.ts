import {
  Body,
  Controller,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { UserService } from '@/user/user.service';
import { CreateUserDto, LoginUserDto } from '@/user/dto/createUser.dto';
import { UserResponseInterface } from './types/userResponse.interface';

@Controller()
export class UserController {
  constructor(private userService: UserService) {}

  @Post('users')
  @UsePipes(new ValidationPipe())
  async registerUser(
    @Body('user') createUserDto: CreateUserDto,
  ): Promise<UserResponseInterface> {
    const user = await this.userService.createUser(createUserDto);
    return this.userService.buildUserResponse(user);
  }

  @Post('users/login')
  @UsePipes(new ValidationPipe())
  async loginUser(
    @Body('user') createUserDto: LoginUserDto,
  ): Promise<UserResponseInterface> {
    const user = await this.userService.loginUser(createUserDto);
    return this.userService.buildUserResponse(user);
  }
}
