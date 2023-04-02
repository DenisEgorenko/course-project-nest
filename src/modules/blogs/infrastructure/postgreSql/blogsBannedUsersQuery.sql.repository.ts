import { IBlogsBannedUsersRepository } from '../../core/abstracts/blogsBannedUsers.repository.abstract';
import { InjectRepository } from '@nestjs/typeorm';
import { BlogsBanInfo } from '../../../users/infrastructure/postgreSql/model/user.entity';
import { Brackets, Repository } from 'typeorm';
import { BlogsBannedUsersQueryModel } from '../../models/blogsBannedUsersQueryModel';

export class BlogsBannedUsersQuerySqlRepository
  implements IBlogsBannedUsersRepository
{
  constructor(
    @InjectRepository(BlogsBanInfo)
    protected blogsBanInfoRepository: Repository<BlogsBanInfo>,
  ) {}

  async findAllBannedUsersForBlog(
    query: BlogsBannedUsersQueryModel,
    blogId: string,
  ) {
    const sortBy = query.sortBy ? query.sortBy : 'createdAt';
    const sortDirection = query.sortDirection === 'asc' ? 'ASC' : 'DESC';

    const pageSize: number = query.pageSize ? +query.pageSize : 10;
    const pageNumber: number = query.pageNumber ? +query.pageNumber : 1;

    const skip: number = pageSize * (pageNumber - 1);

    const items = await this.blogsBanInfoRepository
      .createQueryBuilder('blogBanInfo')
      .leftJoinAndSelect('blogBanInfo.user', 'user')
      .leftJoinAndSelect('blogBanInfo.blog', 'blog')
      .where('blog.id = :blogId', {
        blogId,
      })
      .andWhere('blogBanInfo.isBanned = true')
      .andWhere(
        new Brackets((qb) => {
          const queryArray = [];

          if (query.searchLoginTerm) {
            queryArray.push({
              field: 'login',
              value: query.searchLoginTerm,
            });
          }

          if (queryArray.length) {
            queryArray.map((value) => {
              qb.orWhere(`user.${value.field} ILIKE :${value.field}`, {
                [`${value.field}`]: `%${value.value}%`,
              });
            });
          } else {
            return;
          }
        }),
      )
      .select(['blogBanInfo', 'user.id', 'user.login'])
      .orderBy(`user.${sortBy}`, sortDirection)
      .limit(pageSize)
      .offset(skip)
      .getMany();

    const totalCount = await this.blogsBanInfoRepository
      .createQueryBuilder('blogBanInfo')
      .leftJoinAndSelect('blogBanInfo.user', 'user')
      .leftJoinAndSelect('blogBanInfo.blog', 'blog')
      .where('blog.id = :blogId', {
        blogId,
      })
      .andWhere('blogBanInfo.isBanned = true')
      .andWhere(
        new Brackets((qb) => {
          const queryArray = [];

          if (query.searchLoginTerm) {
            queryArray.push({
              field: 'login',
              value: query.searchLoginTerm,
            });
          }

          if (queryArray.length) {
            queryArray.map((value) => {
              qb.orWhere(`user.${value.field} ILIKE :${value.field}`, {
                [`${value.field}`]: `%${value.value}%`,
              });
            });
          } else {
            return;
          }
        }),
      )
      .select(['blogBanInfo', 'user.id', 'user.login'])
      .orderBy(`user.${sortBy}`, sortDirection)
      .limit(pageSize)
      .offset(skip)
      .getCount();

    return { items, totalCount };
  }
}
