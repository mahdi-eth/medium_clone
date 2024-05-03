import {
  Body,
  Controller,
  Get,
  Post,
  Put,
  Req,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { UserService } from '@/user/user.service';
import { CreateUserDto, LoginUserDto, UpdateUserDto } from '@/user/dto/user.dto';
import { UserResponseInterface } from './types/userResponse.interface';
import { User } from './decorators/user.decorator';
import { UserEntity } from './user.entity';
import { AuthGuard } from './guards/auth.guard';
import { BackendValidationPipe } from '@/shared/pipes/backendValidation.pipe';

@Controller()
export class UserController {
  constructor(private userService: UserService) {}

  @Post('users')
  @UsePipes(new BackendValidationPipe())
  async registerUser(
    @Body('user') createUserDto: CreateUserDto,
  ): Promise<UserResponseInterface> {
    const user = await this.userService.createUser(createUserDto);
    return this.userService.buildUserResponse(user);
  }

  @Post('users/login')
  @UsePipes(new BackendValidationPipe())
  async loginUser(
    @Body('user') createUserDto: LoginUserDto,
  ): Promise<UserResponseInterface> {
    const user = await this.userService.loginUser(createUserDto);
    return this.userService.buildUserResponse(user);
  }

  @Get('user')
  @UseGuards(AuthGuard)
  async currentUser(
    @User() user: UserEntity,
  ): Promise<UserResponseInterface> {
    return this.userService.buildUserResponse(user);
  }

  @Put('user')
  @UseGuards(AuthGuard)
  @UsePipes(new BackendValidationPipe())
  async updateUser(
    @Body('user') updateUserDto: UpdateUserDto,
    @User() user: UserEntity,
  ): Promise<UserResponseInterface> {
    const updatedUser = await this.userService.updateUser(user, updateUserDto);
    return this.userService.buildUserResponse(updatedUser);
  }
}
