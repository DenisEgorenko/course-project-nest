import { Injectable } from '@nestjs/common';
import { ICommentsRepository } from './core/abstracts/comments.repository.abstract';
import { CommentsQueryModel } from './models/commentsQueryModel';
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
    query: CommentsQueryModel,
    postId: string,
  ): Promise<any> {
    return this.commentsQueryRepository.getAllCommentsForPost(query, postId);
  }

  async getAllCommentsForAllUsersPosts(
    query: CommentsQueryModel,
    userId: string,
  ): Promise<any> {
    return this.commentsQueryRepository.getAllCommentsForAllUsersPosts(
      query,
      userId,
    );
  }
}
