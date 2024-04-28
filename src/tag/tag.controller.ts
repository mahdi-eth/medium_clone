import { Controller, Get } from '@nestjs/common';
import { TagService } from '@/tag/tag.service';
import { TagEntity } from '@/tag/tag.entity';

@Controller('/tags')
export class TagController {
  constructor(private readonly tagService: TagService) {}

  @Get()
  async findAll(): Promise<{ tags: string[] }> {
    const tags = await this.tagService.findAll();
    return {
      tags: tags.map((tag) => tag.name),
    };
  }
}
