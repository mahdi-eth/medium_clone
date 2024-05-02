import { ArticleEntity } from "../article.entity";

export type articleType = Omit<ArticleEntity, 'updateTimeStamp'>