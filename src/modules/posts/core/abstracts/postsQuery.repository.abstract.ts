import { PostsQueryModel } from '../../models/postsQueryModel';

export abstract class IPostsQueryRepository {
  abstract getAllPosts(query: PostsQueryModel);

  abstract getAllPostsWithBlogId(query: PostsQueryModel, blogId: string);
}
