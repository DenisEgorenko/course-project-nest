import { commentsQueryModel } from '../../models/commentsQueryModel';

export abstract class ICommentsQueryRepository {
  abstract getAllCommentsForPost(query: commentsQueryModel, postId: string);

  abstract getAllCommentsForAllUsersPosts(
    query: commentsQueryModel,
    userId: string,
  );
}
