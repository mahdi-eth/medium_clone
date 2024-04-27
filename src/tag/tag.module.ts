import { Module } from '@nestjs/common';
import { TagController } from '@/tag/tag.controller';
import { TagService } from '@/tag/tag.service';

@Module({
    controllers: [TagController],
    providers: [TagService]
})
export class TagModule {}
