import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '@/user/user.entity';
import { profileType } from './types/profile.type';
import { profileResponseInterface } from './types/profileResponse.interface';

@Injectable()
export class ProfileService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  buildProfileResponse(profile: profileType): profileResponseInterface {
    delete profile.email;
    delete profile.id;
    return {
      profile,
    };
  }

  async getProfile(
    userId: number,
    profileUsername: string,
  ): Promise<profileType> {
    const user = await this.userRepository.findOne({
      where: { username: profileUsername },
    });

    if (!user) {
      throw new HttpException('Profile not found', HttpStatus.NOT_FOUND);
    }

    return { ...user, folowing: true };
  }
}
