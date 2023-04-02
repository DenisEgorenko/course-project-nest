import { blogsQueryModel } from '../../models/blogsQueryModel';

export abstract class IBlogsQueryRepository {
  abstract getAllBlogs(
    query: blogsQueryModel,
    showBanned: boolean,
    userId?: string,
  );
}
