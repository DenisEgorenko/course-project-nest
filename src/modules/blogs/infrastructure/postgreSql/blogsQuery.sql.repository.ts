import { BlogsQueryModel } from '../../models/blogsQueryModel';
import { IBlogsQueryRepository } from '../../core/abstracts/blogsQuery.repository.abstract';
import { InjectRepository } from '@nestjs/typeorm';
import { Brackets, Repository } from 'typeorm';
import { Blog } from './model/blog.entity';

export class BlogsQuerySqlRepository implements IBlogsQueryRepository {
  constructor(
    @InjectRepository(Blog)
    protected blogsRepository: Repository<Blog>,
  ) {}
  async getAllBlogs(
    query: BlogsQueryModel,
    showBanned: boolean,
    userId?: string,
  ) {
    const sortBy = query.sortBy ? query.sortBy : 'createdAt';
    const sortDirection = query.sortDirection === 'asc' ? 'ASC' : 'DESC';

    const pageSize: number = query.pageSize ? +query.pageSize : 10;
    const pageNumber: number = query.pageNumber ? +query.pageNumber : 1;

    const skip: number = pageSize * (pageNumber - 1);

    const [items, totalCount] = await this.blogsRepository
      .createQueryBuilder('blog')
      .leftJoinAndSelect('blog.user', 'user')
      .where(
        new Brackets((qb) => {
          if (!showBanned) {
            qb.where('blog.isBanned = :showBanned', {
              showBanned,
            });
          } else {
            return;
          }
        }),
      )
      .andWhere(
        new Brackets((qb) => {
          const queryArray = [];

          if (query.searchNameTerm) {
            queryArray.push({
              field: 'name',
              name: query.searchNameTerm,
            });
          }

          if (queryArray.length) {
            queryArray.map((value) => {
              qb.orWhere(`blog.${value.field} ILIKE :${value.field}`, {
                [`${value.field}`]: `%${value.name}%`,
              });
            });
          } else {
            return;
          }
        }),
      )
      .andWhere(
        new Brackets((qb) => {
          if (userId) {
            qb.orWhere('user.id = :userId', {
              userId,
            });
          } else {
            return;
          }
        }),
      )
      .select(['blog', 'user.id', 'user.login'])
      .orderBy(`blog.${sortBy}`, sortDirection)
      .skip(skip)
      .take(pageSize)
      .getManyAndCount();

    return { items, totalCount };
  }
}
