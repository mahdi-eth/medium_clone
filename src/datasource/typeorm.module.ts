import { DataSource } from 'typeorm';
import { Global, Module } from '@nestjs/common';
import { TagEntity } from '@/tag/tag.entity';
import { UserEntity } from '@/user/user.entity';
import { ArticleEntity } from '@/article/article.entity';

@Global()
@Module({
  imports: [],
  providers: [
    {
      provide: DataSource,
      inject: [],
      useFactory: async () => {
        try {
          const appDataSource = new DataSource({
            type: 'postgres',
            host: process.env.POSTGRES_HOST,
            port: Number(process.env.POSTGRES_PORT) ?? 5432,
            username: process.env.POSTGRES_USER,
            password: process.env.POSTGRES_PASSWORD,
            database: process.env.POSTGRES_DB,
            entities: [TagEntity, UserEntity, ArticleEntity],
            synchronize: true,
          });
          await appDataSource.initialize();
          console.log('Database connected successfully');
          return appDataSource;
        } catch (error) {
          console.log('Error connecting to database');
          throw error;
        }
      },
    },
  ],
  exports: [DataSource],
})
export class TypeOrmModule {}
