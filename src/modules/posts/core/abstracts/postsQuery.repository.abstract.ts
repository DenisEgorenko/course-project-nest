import { blogsQueryModel } from '../../../blogs/models/blogsQueryModel';
import { postsQueryModel } from '../../models/postsQueryModel';

export abstract class IPostsQueryRepository {
  abstract getAllPosts(query: postsQueryModel, blogId?: string);
}
