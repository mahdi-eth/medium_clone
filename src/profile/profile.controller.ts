import { profileResponseInterface } from './types/profileResponse.interface';
import { User } from '@/user/decorators/user.decorator';
import { Controller, Delete, Get, Param, Post, UseGuards } from '@nestjs/common';
import { ProfileService } from './profile.service';
import { AuthGuard } from '@/user/guards/auth.guard';

@Controller('/profiles')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @Get(':username')
  async getProfile(@User('id') userId: number, @Param('username') profileUsername: string): Promise<profileResponseInterface> {
    const profile = await this.profileService.getProfile(userId, profileUsername);
    return this.profileService.buildProfileResponse(profile);
  }

  @Post(':username/follow')
  @UseGuards(AuthGuard)
  async followProfile(@User('id') userId: number, @Param('username') profileUsername: string): Promise<profileResponseInterface> {
    const profile = await this.profileService.followProfile(userId, profileUsername);
    return this.profileService.buildProfileResponse(profile);
  }

  @Delete(':username/follow')
  @UseGuards(AuthGuard)
  async unfollowProfile(@User('id') userId: number, @Param('username') profileUsername: string): Promise<profileResponseInterface> {
    const profile = await this.profileService.unfollowProfile(userId, profileUsername);
    return this.profileService.buildProfileResponse(profile);
  }
}
