import { blogsQueryModel } from '../../models/blogsQueryModel';
import { IBlogsQueryRepository } from '../../core/abstracts/blogsQuery.repository.abstract';
import { InjectRepository } from '@nestjs/typeorm';
import { BlogsBanInfo } from '../../../users/infrastructure/postgreSql/model/user.entity';
import { Brackets, Repository } from 'typeorm';
import { Blog } from './model/blog.entity';

export class BlogsQuerySqlRepository implements IBlogsQueryRepository {
  constructor(
    @InjectRepository(Blog)
    protected blogsRepository: Repository<Blog>,
  ) {}
  async getAllBlogs(
    query: blogsQueryModel,
    showBanned: boolean,
    userId?: string,
  ) {
    const sortBy = query.sortBy ? query.sortBy : 'createdAt';
    const sortDirection = query.sortDirection === 'asc' ? 'ASC' : 'DESC';

    const pageSize: number = query.pageSize ? +query.pageSize : 10;
    const pageNumber: number = query.pageNumber ? +query.pageNumber : 1;

    const skip: number = pageSize * (pageNumber - 1);

    const totalCount = await this.blogsRepository
      .createQueryBuilder('blog')
      .leftJoinAndSelect('blog.user', 'user')
      .where((qb) => {
        if (userId) {
          qb.where('user.id = :userId', {
            userId,
          });
        } else {
          return;
        }
      })
      .andWhere((qb) => {
        if (showBanned !== undefined) {
          qb.where('blog.isBanned = :showBanned', {
            showBanned,
          });
        } else {
          return;
        }
      })
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
                [`${value.field}`]: `%${value.value}%`,
              });
            });
          } else {
            return;
          }
        }),
      )
      .getCount();

    const items = await this.blogsRepository
      .createQueryBuilder('blog')
      .leftJoinAndSelect('blog.user', 'user')
      .where((qb) => {
        if (userId) {
          qb.where('user.id = :userId', {
            userId,
          });
        } else {
          return;
        }
      })
      .andWhere((qb) => {
        if (showBanned !== null) {
          qb.where('blog.isBanned = :showBanned', {
            showBanned,
          });
        } else {
          return;
        }
      })
      .andWhere(
        new Brackets((qb) => {
          const queryArray = [];

          if (query.searchNameTerm) {
            queryArray.push({
              field: 'name',
              value: query.searchNameTerm,
            });
          }

          if (queryArray.length) {
            queryArray.map((value) => {
              qb.orWhere(`blog.${value.field} ILIKE :${value.field}`, {
                [`${value.field}`]: `%${value.value}%`,
              });
            });
          } else {
            return;
          }
        }),
      )
      .select(['blog', 'user.id', 'user.login'])
      .orderBy(`blog.${sortBy}`, sortDirection)
      .limit(pageSize)
      .offset(skip)
      .getMany();

    console.log(items);
    return { items, totalCount };
  }
}
