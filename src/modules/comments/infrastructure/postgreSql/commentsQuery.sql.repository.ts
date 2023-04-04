import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { ICommentsQueryRepository } from '../../core/abstracts/commentsQuery.repository.abstract';
import { commentsQueryModel } from '../../models/commentsQueryModel';
import { Comment } from './model/comments.entity';

@Injectable()
export class CommentsQuerySqlRepository implements ICommentsQueryRepository {
  constructor(
    @InjectRepository(Comment)
    protected commentsRepository: Repository<Comment>,
  ) {}
  async getAllCommentsForPost(query: commentsQueryModel, postId: string) {
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
      .leftJoinAndSelect('user.userBanInfo', 'userBanInfo')
      .where('post.id = :postId', {
        postId,
      })
      .andWhere('userBanInfo.banStatus = false')
      .orderBy(`comment.${sortBy}`, sortDirection)
      .addOrderBy(`commentsLikes.createdAt`, 'DESC')
      .limit(pageSize)
      .offset(skip)
      .getManyAndCount();

    return { items, totalCount };
  }

  async getAllCommentsForAllUsersPosts(
    query: commentsQueryModel,
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
      .leftJoinAndSelect('user.userBanInfo', 'userBanInfo')
      .where('userBlog.id = :userId', {
        userId,
      })
      .andWhere('userBanInfo.banStatus = false')
      .orderBy(`comment.${sortBy}`, sortDirection)
      .addOrderBy(`commentsLikes.createdAt`, 'DESC')
      .limit(pageSize)
      .offset(skip)
      .getManyAndCount();

    return { items, totalCount };
  }
}
