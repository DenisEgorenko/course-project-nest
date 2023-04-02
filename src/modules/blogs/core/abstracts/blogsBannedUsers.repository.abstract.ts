import { BlogsBannedUsersQueryModel } from '../../models/blogsBannedUsersQueryModel';

export abstract class IBlogsBannedUsersRepository {
  abstract findAllBannedUsersForBlog(
    query: BlogsBannedUsersQueryModel,
    blogId: string,
  );
}
