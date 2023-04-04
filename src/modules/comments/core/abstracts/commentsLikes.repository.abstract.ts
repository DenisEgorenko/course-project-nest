import { CommentLike } from '../../infrastructure/postgreSql/model/comments.entity';

export abstract class ICommentsLikesRepository {
  abstract save(commentLike: CommentLike);

  abstract getCommentLike(commentId: string, userId: string);
  abstract deleteCommentLike(commentId: string, userId: string);
}
