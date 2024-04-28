import { Module } from '@nestjs/common';
import { AppController } from '@/app.controller';
import { AppService } from '@/app.service';
import { TagModule } from '@/tag/tag.module';
import { TypeOrmModule } from '@/datasource/typeorm.module';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from '@/user/user.module';

@Module({
  imports: [ConfigModule.forRoot(), TypeOrmModule, TagModule, UserModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
