import { IsNotEmpty, IsOptional } from 'class-validator';

export class CreateArticleDto {
  @IsNotEmpty()
  readonly title: string;

  @IsNotEmpty()
  readonly description: string;

  @IsNotEmpty()
  readonly body: string;

  readonly tagList?: string[];
}

export class UpdateArticleDto {
  @IsOptional()
  @IsNotEmpty()
  readonly title?: string;

  @IsOptional()
  @IsNotEmpty()
  readonly description?: string;

  @IsOptional()
  @IsNotEmpty()
  readonly body?: string;
}