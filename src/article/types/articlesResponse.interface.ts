import { articleType } from './article.type';

interface SingleEntityInFeedInterface extends articleType {
  favorited: boolean
}

export interface ArticlesResponseInterface {
  articles: SingleEntityInFeedInterface[];
  articlesCount: number;
}
