import { Module } from '@nestjs/common';
import { AppController } from '@/app.controller';
import { AppService } from '@/app.service';
import { TagModule } from '@/tag/tag.module';
import { TypeOrmModule } from '@/datasource/typeorm.module';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from './users/users.module';

@Module({
  imports: [ConfigModule.forRoot(), TypeOrmModule, TagModule, UsersModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
