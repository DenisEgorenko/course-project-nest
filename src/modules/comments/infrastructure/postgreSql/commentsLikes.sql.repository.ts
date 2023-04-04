import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ICommentsLikesRepository } from '../../core/abstracts/commentsLikes.repository.abstract';
import { CommentLike } from './model/comments.entity';

@Injectable()
export class CommentsLikesSqlRepository implements ICommentsLikesRepository {
  constructor(
    @InjectRepository(CommentLike)
    protected commentsLikesRepository: Repository<CommentLike>,
  ) {}

  async save(comment: CommentLike) {
    return this.commentsLikesRepository.save(comment);
  }

  async getCommentLike(commentId: string, userId: string) {
    return await this.commentsLikesRepository.findOne({
      relations: {
        comment: true,
        user: true,
      },
      where: {
        comment: { id: commentId },
        user: { id: userId },
      },
    });
  }
  async deleteCommentLike(commentId: string, userId: string) {
    return await this.commentsLikesRepository.delete({
      user: { id: userId },
      comment: { id: commentId },
    });
  }
}
