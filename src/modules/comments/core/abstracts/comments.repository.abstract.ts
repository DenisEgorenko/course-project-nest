export abstract class ICommentsRepository {
  abstract save(comment: any);

  abstract getCommentById(commentId: string);
  abstract deleteCommentById(commentId: string);
}
