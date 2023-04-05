import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { ICommentsQueryRepository } from '../../core/abstracts/commentsQuery.repository.abstract';
import { CommentsQueryModel } from '../../models/commentsQueryModel';
import { Comment } from './model/comments.entity';

@Injectable()
export class CommentsQuerySqlRepository implements ICommentsQueryRepository {
  constructor(
    @InjectRepository(Comment)
    protected commentsRepository: Repository<Comment>,
  ) {}
  async getAllCommentsForPost(query: CommentsQueryModel, postId: string) {
    const sortBy = query.sortBy ? query.sortBy : 'createdAt';
    const sortDirection = query.sortDirection === 'asc' ? 'ASC' : 'DESC';

    const pageSize: number = query.pageSize ? +query.pageSize : 10;
    const pageNumber: number = query.pageNumber ? +query.pageNumber : 1;

    const skip: number = pageSize * (pageNumber - 1);

    const [items, totalCount] = await this.commentsRepository
      .createQueryBuilder('comment')
      .leftJoinAndSelect('comment.user', 'user')
      .leftJoinAndSelect('comment.post', 'post')
      .leftJoinAndSelect('comment.commentsLikes', 'commentsLikes')
      .leftJoinAndSelect('commentsLikes.user', 'userLike')
      .leftJoinAndSelect('userLike.userBanInfo', 'userLikeBanInfo')
      .leftJoinAndSelect(
        'user.userBanInfo',
        'userBanInfo',
        'userBanInfo.banStatus = false',
      )
      .where('post.id = :postId', {
        postId,
      })
      .orderBy(`comment.${sortBy}`, sortDirection)
      .addOrderBy(`commentsLikes.createdAt`, 'DESC')
      .limit(pageSize)
      .offset(skip)
      .getManyAndCount();

    return { items, totalCount };
  }

  async getAllCommentsForAllUsersPosts(
    query: CommentsQueryModel,
    userId: string,
  ) {
    const sortBy = query.sortBy ? query.sortBy : 'createdAt';
    const sortDirection = query.sortDirection === 'asc' ? 'ASC' : 'DESC';

    const pageSize: number = query.pageSize ? +query.pageSize : 10;
    const pageNumber: number = query.pageNumber ? +query.pageNumber : 1;

    const skip: number = pageSize * (pageNumber - 1);

    const [items, totalCount] = await this.commentsRepository
      .createQueryBuilder('comment')
      .leftJoinAndSelect('comment.user', 'user')
      .leftJoinAndSelect('comment.post', 'post')
      .leftJoinAndSelect('post.blog', 'blog')
      .leftJoinAndSelect('blog.user', 'userBlog')
      .leftJoinAndSelect('comment.commentsLikes', 'commentsLikes')
      .leftJoinAndSelect('commentsLikes.user', 'userLike')
      .leftJoinAndSelect('userLike.userBanInfo', 'userLikeBanInfo')
      .leftJoinAndSelect(
        'user.userBanInfo',
        'userBanInfo',
        'userBanInfo.banStatus = false',
      )
      .where('userBlog.id = :userId', {
        userId,
      })
      .orderBy(`comment.${sortBy}`, sortDirection)
      .addOrderBy(`commentsLikes.createdAt`, 'DESC')
      .limit(pageSize)
      .offset(skip)
      .getManyAndCount();

    return { items, totalCount };
  }
}
