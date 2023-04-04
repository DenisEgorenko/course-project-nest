import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ICommentsRepository } from '../../core/abstracts/comments.repository.abstract';
import { Comment } from './model/comments.entity';

@Injectable()
export class CommentsSqlRepository implements ICommentsRepository {
  constructor(
    @InjectRepository(Comment)
    protected commentsRepository: Repository<Comment>,
  ) {}

  async save(comment: Comment) {
    return this.commentsRepository.save(comment);
  }
  async getCommentById(commentId: string) {
    const comment = await this.commentsRepository.findOne({
      relations: {
        post: true,
        user: { userBanInfo: true },
        commentsLikes: { user: { userBanInfo: true } },
      },
      where: {
        id: commentId,
        // commentsLikes: { user: { userBanInfo: { banStatus: false } } },
      },
      order: {
        commentsLikes: { createdAt: 'DESC' },
      },
    });

    return comment;
  }

  async deleteCommentById(commentId: string) {
    return await this.commentsRepository.delete({ id: commentId });
  }
}
