import { IPostsQueryRepository } from '../../core/abstracts/postsQuery.repository.abstract';
import { blogsQueryModel } from '../../../blogs/models/blogsQueryModel';
import { InjectRepository } from '@nestjs/typeorm';
import { Post } from './model/post.entity';
import { postsQueryModel } from '../../models/postsQueryModel';
import { Brackets, Repository } from 'typeorm';

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

    const totalCount = await this.postsRepository
      .createQueryBuilder('post')
      .leftJoinAndSelect('post.blog', 'blog')
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

    const items = await this.postsRepository
      .createQueryBuilder('post')
      .leftJoinAndSelect('post.blog', 'blog')
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
      .limit(pageSize)
      .offset(skip)
      .getMany();
    return { items, totalCount };
  }
}
