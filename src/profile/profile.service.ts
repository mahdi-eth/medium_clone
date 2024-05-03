import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '@/user/user.entity';
import { profileType } from './types/profile.type';
import { profileResponseInterface } from './types/profileResponse.interface';
import { FollowEntity } from './entities/follow.entity';

@Injectable()
export class ProfileService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    @InjectRepository(FollowEntity)
    private readonly followRepository: Repository<FollowEntity>,
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

    return { ...user, following: true };
  }

  async followProfile(
    userId: number,
    profileUsername: string,
  ): Promise<profileType> {
    const user = await this.userRepository.findOne({
      where: { username: profileUsername },
    });

    if (!user) {
      throw new HttpException('Profile not found', HttpStatus.NOT_FOUND);
    }

    if (userId === user.id) {
      throw new HttpException("Can't follow yourself", HttpStatus.BAD_REQUEST);
    }

    const follow = await this.followRepository.findOne({
      where: { followerId: userId, followingId: user.id },
    });

    if (!follow) {
      const followToCreate = new FollowEntity();
      followToCreate.followerId = userId;
      followToCreate.followingId = user.id;
      await this.followRepository.save(followToCreate);
    }

    return { ...user, following: true };
  }

  async unfollowProfile(
    userId: number,
    profileUsername: string,
  ): Promise<profileType> {
    const user = await this.userRepository.findOne({
      where: { username: profileUsername },
    });

    if (!user) {
      throw new HttpException('Profile not found', HttpStatus.NOT_FOUND);
    }

    if (userId === user.id) {
      throw new HttpException(
        "Can't unfollow yourself",
        HttpStatus.BAD_REQUEST,
      );
    }

    const follow = await this.followRepository.findOne({
      where: { followerId: userId, followingId: user.id },
    });

    if (!follow) {
      return { ...user, following: false };
    }

    await this.followRepository.remove(follow);

    return { ...user, following: false };
  }
}
