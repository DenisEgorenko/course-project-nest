import { PostLike } from '../../infrastructure/postgreSql/model/post.entity';

export abstract class IPostsLikesRepository {
  abstract save(postLike: PostLike);

  abstract getPostLike(postId: string, userId: string);
  abstract deletePostLike(postId: string, userId: string);
}
