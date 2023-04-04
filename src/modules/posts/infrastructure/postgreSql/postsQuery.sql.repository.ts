import { IPostsQueryRepository } from '../../core/abstracts/postsQuery.repository.abstract';
import { InjectRepository } from '@nestjs/typeorm';
import { Post } from './model/post.entity';
import { postsQueryModel } from '../../models/postsQueryModel';
import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';

@Injectable()
export class PostsQuerySqlRepository implements IPostsQueryRepository {
  constructor(
    @InjectRepository(Post)
    protected postsRepository: Repository<Post>,
  ) {}
  async getAllPosts(query: postsQueryModel, blogId?: string) {
    const sortBy = query.sortBy ? query.sortBy : 'createdAt';
    const sortDirection = query.sortDirection === 'asc' ? 'ASC' : 'DESC';

    const pageSize: number = query.pageSize ? +query.pageSize : 10;
    const pageNumber: number = query.pageNumber ? +query.pageNumber : 1;

    const skip: number = pageSize * (pageNumber - 1);

    const items = await this.postsRepository
      .createQueryBuilder('post')
      .leftJoinAndSelect('post.blog', 'blog')
      .leftJoinAndSelect('post.postLikes', 'postLikes')
      .leftJoinAndSelect('postLikes.user', 'user')
      .leftJoinAndSelect('user.userBanInfo', 'userBanInfo')
      .where((qb) => {
        if (blogId) {
          qb.where('blog.id = :blogId', {
            blogId,
          });
        } else {
          return;
        }
      })
      .andWhere('blog.isBanned = false')
      .orderBy(`blog.${sortBy}`, sortDirection)
      .addOrderBy(`postLikes.createdAt`, 'DESC')
      .limit(pageSize)
      .offset(skip)
      .getMany();

    const totalCount = await this.postsRepository
      .createQueryBuilder('post')
      .leftJoinAndSelect('post.blog', 'blog')
      .leftJoinAndSelect('post.postLikes', 'postLikes')
      .leftJoinAndSelect('postLikes.user', 'user')
      .leftJoinAndSelect('user.userBanInfo', 'userBanInfo')
      .where((qb) => {
        if (blogId) {
          qb.where('blog.id = :blogId', {
            blogId,
          });
        } else {
          return;
        }
      })
      .andWhere('blog.isBanned = false')
      .getCount();

    console.log(items, totalCount);

    return { items, totalCount };
  }
}
