import { IsEmail, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty()
  readonly username: string;

  @IsNotEmpty()
  @IsEmail()
  readonly email: string;

  @IsNotEmpty()
  readonly password: string;
}

export class LoginUserDto {
  @IsNotEmpty()
  @IsEmail()
  readonly email: string;

  @IsNotEmpty()
  readonly password: string;
}

export class UpdateUserDto {
  @IsOptional()
  @IsEmail()
  readonly email: string;

  @IsOptional()
  readonly username: string;

  @IsOptional()
  readonly bio: string;

  @IsOptional()
  readonly image: string;
}
