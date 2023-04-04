import { CommentsQueryModel } from '../../models/commentsQueryModel';

export abstract class ICommentsQueryRepository {
  abstract getAllCommentsForPost(query: CommentsQueryModel, postId: string);

  abstract getAllCommentsForAllUsersPosts(
    query: CommentsQueryModel,
    userId: string,
  );
}
