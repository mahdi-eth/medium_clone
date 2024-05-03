import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import {
  CreateUserDto,
  LoginUserDto,
  UpdateUserDto,
} from '@/user/dto/user.dto';
import { UserEntity } from '@/user/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { sign } from 'jsonwebtoken';
import { compare } from 'bcrypt';
import { UserResponseInterface } from './types/userResponse.interface';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  async createUser(createUserDto: CreateUserDto): Promise<UserEntity> {
    const errorResponse = {
      errors: {},
    };
    const userByEmail = await this.userRepository.findOne({
      where: {
        email: createUserDto.email,
      },
    });

    const userByUsername = await this.userRepository.findOne({
      where: { username: createUserDto.email },
    });

    if (userByEmail) {
      errorResponse.errors['email'] = 'has already been taken';
    }

    if (userByUsername) {
      errorResponse.errors['username'] = 'has already been taken';
    }

    if (userByEmail || userByUsername) {
      throw new HttpException(errorResponse, HttpStatus.UNPROCESSABLE_ENTITY);
    }

    const newUser = new UserEntity();
    Object.assign(newUser, createUserDto);
    await this.userRepository.save(newUser);
    return newUser;
  }

  async loginUser(loginUserDto: LoginUserDto): Promise<UserEntity> {
    const errorResponse = {
      errors: {
        'email or password': 'is invalid',
      },
    };
    const user = await this.userRepository.findOne({
      where: {
        email: loginUserDto.email,
      },
      select: ['id', 'username', 'email', 'bio', 'image', 'password'],
    });

    if (!user) {
      throw new HttpException(errorResponse, HttpStatus.NOT_FOUND);
    }

    const isPasswordValid = await compare(loginUserDto.password, user.password);

    if (!isPasswordValid) {
      throw new HttpException(errorResponse, HttpStatus.UNAUTHORIZED);
    }

    delete user.password;

    return user;
  }

  async updateUser(
    user: UserEntity,
    updateUserDto: UpdateUserDto,
  ): Promise<UserEntity> {
    if (updateUserDto?.email) {
      user.email = updateUserDto.email;
    }
    if (updateUserDto?.username) {
      user.username = updateUserDto.username;
    }
    if (updateUserDto?.bio) {
      user.bio = updateUserDto.bio;
    }
    if (updateUserDto?.image) {
      user.image = updateUserDto.image;
    }
    await this.userRepository.save(user);

    return user;
  }

  async findById(id: number): Promise<UserEntity> {
    return this.userRepository.findOne({ where: { id } });
  }

  generateJwt(user: UserEntity): string {
    return sign(
      {
        id: user.id,
        username: user.username,
        email: user.email,
      },
      process.env.JWT_SECRET,
    );
  }

  buildUserResponse(user: UserEntity): UserResponseInterface {
    return {
      user: {
        ...user,
        token: this.generateJwt(user),
      },
    };
  }
}
