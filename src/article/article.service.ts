import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Like, Repository } from 'typeorm';
import { ArticleEntity } from './article.entity';
import { CreateArticleDto, UpdateArticleDto } from './dto/article.dto';
import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UserEntity } from '@/user/user.entity';
import { ArticleResponseInterface } from './types/articleResponse.Interface';
import slugify from 'slugify';
import { ArticlesResponseInterface } from './types/articlesResponse.interface';
import { FollowEntity } from '@/profile/entities/follow.entity';

@Injectable()
export class ArticleService {
  constructor(
    @InjectRepository(ArticleEntity)
    private readonly articleRepository: Repository<ArticleEntity>,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    @InjectRepository(FollowEntity)
    private readonly followRepository: Repository<FollowEntity>,
    private readonly dataSource: DataSource,
  ) {}

  buildArticleResponse(article: ArticleEntity): ArticleResponseInterface {
    return { article };
  }

  private getSlug(title: string): string {
    return (
      slugify(title, { lower: true }) +
      '-' +
      ((Math.random() * Math.pow(36, 6)) | 0).toString(36)
    );
  }

  async findAll(query: any, id: number): Promise<ArticlesResponseInterface> {
    const queryBuilder = this.dataSource
      .getRepository(ArticleEntity)
      .createQueryBuilder('articles')
      .leftJoinAndSelect('articles.author', 'author');

    const articlesCount = await queryBuilder.getCount();

    queryBuilder.orderBy('articles.createdAt', 'DESC');

    if (query.limit) {
      queryBuilder.limit(query.limit);
    }

    if (query.offset) {
      queryBuilder.offset(query.offset);
    }

    if (query.tag) {
      queryBuilder.andWhere('articles.tagList LIKE :tag', {
        tag: `%${query.tag}%`,
      });
    }

    if (query.favorited) {
      const user = await this.userRepository.findOne({
        where: { username: query.favorited },
        relations: ['favorites'],
      });
      const ids = user.favorites.map((el) => el.id);

      if (ids.length > 0) {
        queryBuilder.andWhere('articles.id IN (:...ids)', { ids });
      } else {
        queryBuilder.andWhere('1=0');
      }
    }

    if (query.author) {
      const author = await this.userRepository.findOne({
        where: {
          username: Like(`%${query.author}%`),
        },
      });

      queryBuilder.andWhere('articles.authorId = :id', {
        id: author.id,
      });
    }

    let favoriteIds: number[] = [];

    if (id) {
      const user = await this.userRepository.findOne({
        where: { id },
        relations: ['favorites'],
      });

      favoriteIds = user.favorites.map((el) => el.id);
    }

    const articles = await queryBuilder.getMany();
    const articlesWithFavortied = articles.map((article) => {
      const favorited = favoriteIds.includes(article.id);
      return {
        ...article,
        favorited,
      };
    });

    return { articles: articlesWithFavortied, articlesCount };
  }

  async getFeed(id: number, query: any): Promise<ArticlesResponseInterface> {
    const follows = await this.followRepository.find({
      where: { followerId: id },
    });

    if (follows.length === 0) {
      return { articles: [], articlesCount: 0 };
    }

    const followingUserIds = follows.map((follow) => follow.followingId);

    const queryBuilder = this.dataSource
      .getRepository(ArticleEntity)
      .createQueryBuilder('articles')
      .leftJoinAndSelect('articles.author', 'author')
      .where('articles.author.id IN (:...ids)', { ids: followingUserIds });

    const articlesCount = await queryBuilder.getCount();

    queryBuilder.orderBy('articles.createdAt', 'DESC');

    if (query.limit) {
      queryBuilder.limit(query.limit);
    }

    if (query.offset) {
      queryBuilder.offset(query.offset);
    }

    let favoriteIds: number[] = [];

    if (id) {
      const user = await this.userRepository.findOne({
        where: { id },
        relations: ['favorites'],
      });

      favoriteIds = user.favorites.map((el) => el.id);
    }

    const articles = await queryBuilder.getMany();
    const articlesWithFavortied = articles.map((article) => {
      const favorited = favoriteIds.includes(article.id);
      return {
        ...article,
        favorited,
      };
    });

    return { articles: articlesWithFavortied, articlesCount };
  }

  async createArticle(
    currentUser: UserEntity,
    createArticleDto: CreateArticleDto,
  ): Promise<ArticleEntity> {
    const article = new ArticleEntity();
    Object.assign(article, createArticleDto);
    if (!article.tagList) {
      article.tagList = [];
    }

    article.author = currentUser;
    article.slug = this.getSlug(article.title);

    return await this.articleRepository.save(article);
  }

  async updateArticle(
    currentUserId: number,
    slug: string,
    updateArticleDto: UpdateArticleDto,
  ): Promise<ArticleEntity> {
    const article = await this.articleRepository.findOne({ where: { slug } });

    if (!article) {
      throw new NotFoundException(`Article with slug "${slug}" not found`);
    }

    if (article.author.id !== currentUserId) {
      throw new HttpException(
        'You are not authorized to update this article',
        HttpStatus.FORBIDDEN,
      );
    }

    Object.assign(article, updateArticleDto);

    article.slug = this.getSlug(article.title);

    return this.articleRepository.save(article);
  }

  async getArticleBySlug(slug: string): Promise<ArticleEntity> {
    const article = await this.articleRepository.findOne({ where: { slug } });
    if (!article) {
      throw new HttpException(
        `Article with slug '${slug}' not found`,
        HttpStatus.NOT_FOUND,
      );
    }
    return article;
  }

  async deleteArticle(currentUserId: number, slug: string): Promise<void> {
    const article = await this.getArticleBySlug(slug);
    if (!article) {
      throw new HttpException(
        `Article with slug '${slug}' not found`,
        HttpStatus.NOT_FOUND,
      );
    }

    if (article.author.id !== currentUserId) {
      throw new HttpException(
        `You are not authorized to delete this article`,
        HttpStatus.FORBIDDEN,
      );
    }
    await this.articleRepository.delete(article.id);
  }

  async addArticleToFavorites(
    slug: string,
    id: number,
  ): Promise<ArticleEntity> {
    const article = await this.getArticleBySlug(slug);
    const user = await this.userRepository.findOne({
      where: { id },
      relations: ['favorites'],
    });

    const isNotFavorited =
      user.favorites.findIndex(
        (articleInFavorites) => articleInFavorites.id === article.id,
      ) === -1;

    if (isNotFavorited) {
      user.favorites.push(article);
      article.favoritesCount++;
      await this.userRepository.save(user);
      await this.articleRepository.save(article);
    }

    return article;
  }

  async removeArticleFromFavorites(
    slug: string,
    id: number,
  ): Promise<ArticleEntity> {
    const article = await this.getArticleBySlug(slug);
    const user = await this.userRepository.findOne({
      where: { id },
      relations: ['favorites'],
    });

    const articleIndex = user.favorites.findIndex(
      (articleInFavorites) => articleInFavorites.id === article.id,
    );

    if (articleIndex !== -1) {
      user.favorites.splice(articleIndex, 1);
      article.favoritesCount--;
      await this.userRepository.save(user);
      await this.articleRepository.save(article);
    }

    return article;
  }
}
