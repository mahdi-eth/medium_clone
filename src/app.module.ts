import { Module } from '@nestjs/common';
import { AppController } from '@/app.controller';
import { AppService } from '@/app.service';
import { TagModule } from '@/tag/tag.module';

@Module({
  imports: [TagModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
