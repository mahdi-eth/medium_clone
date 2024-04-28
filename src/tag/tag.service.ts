import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { TagEntity } from '@/tag/tag.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class TagService {
  constructor(
    @InjectRepository(TagEntity)
    private readonly tagRepository: Repository<TagEntity>,
  ) {}

  async findAll(): Promise<TagEntity[]> {
    return await this.tagRepository.find();
  }
}
