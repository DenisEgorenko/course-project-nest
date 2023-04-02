import { PostBaseEntity } from '../entity/postBase.entity';

export abstract class IPostsRepository {
  abstract save(post: PostBaseEntity);

  abstract getPostById(postId: string);
  abstract deletePostById(postId: string);
}
