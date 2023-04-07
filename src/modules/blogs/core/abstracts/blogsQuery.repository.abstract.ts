import { BlogsQueryModel } from '../../models/blogsQueryModel';

export abstract class IBlogsQueryRepository {
  abstract getAllBlogs(
    query: BlogsQueryModel,
    showBanned: boolean,
    userId?: string,
  );
}
