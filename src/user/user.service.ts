import { Injectable } from '@nestjs/common';
import { CreateUserDto } from '@/user/dto/createUser.dto';
import { UserEntity } from '@/user/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  async createUser(createUserDto: CreateUserDto): Promise<UserEntity> {
    const newUser = new UserEntity();
    Object.assign(newUser, createUserDto);
    await this.userRepository.save(newUser);
    return newUser;
  }
}
