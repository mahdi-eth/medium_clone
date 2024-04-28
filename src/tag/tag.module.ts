import { Module } from '@nestjs/common';
import { TagController } from '@/tag/tag.controller';
import { TagService } from '@/tag/tag.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TagEntity } from '@/tag/tag.entity';

@Module({
  imports: [TypeOrmModule.forFeature([TagEntity])],
  controllers: [TagController],
  providers: [TagService],
})
export class TagModule {}
