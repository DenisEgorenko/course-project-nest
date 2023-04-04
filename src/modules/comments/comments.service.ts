import { Injectable } from '@nestjs/common';
import { ICommentsRepository } from './core/abstracts/comments.repository.abstract';
import { commentsQueryModel } from './models/commentsQueryModel';
import { ICommentsQueryRepository } from './core/abstracts/commentsQuery.repository.abstract';

@Injectable()
export class CommentsService {
  constructor(
    protected commentsRepository: ICommentsRepository,
    protected commentsQueryRepository: ICommentsQueryRepository,
  ) {}

  async getCommentById(commentId: string) {
    return this.commentsRepository.getCommentById(commentId);
  }

  async deleteCommentById(commentId: string): Promise<any> {
    return this.commentsRepository.deleteCommentById(commentId);
  }

  async getAllCommentsForPost(
    query: commentsQueryModel,
    postId: string,
  ): Promise<any> {
    return this.commentsQueryRepository.getAllCommentsForPost(query, postId);
  }

  async getAllCommentsForAllUsersPosts(
    query: commentsQueryModel,
    userId: string,
  ): Promise<any> {
    return this.commentsQueryRepository.getAllCommentsForAllUsersPosts(
      query,
      userId,
    );
  }
}
