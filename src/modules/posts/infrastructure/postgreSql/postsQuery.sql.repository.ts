import { IPostsQueryRepository } from '../../core/abstracts/postsQuery.repository.abstract';
import { InjectRepository } from '@nestjs/typeorm';
import { Post } from './model/post.entity';
import { PostsQueryModel } from '../../models/postsQueryModel';
import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';

@Injectable()
export class PostsQuerySqlRepository implements IPostsQueryRepository {
  constructor(
    @InjectRepository(Post)
    protected postsRepository: Repository<Post>,
  ) {}
  async getAllPosts(query: PostsQueryModel, blogId?: string) {
    // const sortBy = query.sortBy ? query.sortBy : 'createdAt';
    let sortBy: string;

    if (query.sortBy) {
      if (query.sortBy === 'blogName') {
        sortBy = 'blog.name';
      } else if (query.sortBy === 'blogId') {
        sortBy = 'blog.id';
      } else {
        sortBy = `post.${query.sortBy}`;
      }
    } else {
      sortBy = 'post.createdAt';
    }

    const sortDirection = query.sortDirection === 'asc' ? 'ASC' : 'DESC';

    const pageSize: number = query.pageSize ? +query.pageSize : 10;
    const pageNumber: number = query.pageNumber ? +query.pageNumber : 1;

    const skip: number = pageSize * (pageNumber - 1);

    const [items, totalCount] = await this.postsRepository
      .createQueryBuilder('post')
      .leftJoinAndSelect('post.blog', 'blog', 'blog.isBanned = false')
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
      .select([
        'post',
        'blog',
        'postLikes',
        'userBanInfo',
        'user.id',
        'user.login',
      ])
      .orderBy(`${sortBy}`, sortDirection)
      .skip(skip)
      .take(pageSize)
      .getManyAndCount();

    // const [items, totalCount] = await this.postsRepository.findAndCount({
    //   relations: {
    //     blog: true,
    //     postLikes: { user: { userBanInfo: true } },
    //   },
    //   where: {
    //     blog: {
    //       isBanned: false,
    //     },
    //   },
    //   order: {
    //     [`${sortBy}`]: sortDirection,
    //   },
    //   skip: skip,
    //   take: pageSize,
    // });

    return { items, totalCount };
  }

  // async getAllPostsWithBlogId(query: PostsQueryModel, blogId: string) {
  //   const sortBy = query.sortBy ? query.sortBy : 'createdAt';
  //   const sortDirection = query.sortDirection === 'asc' ? 'ASC' : 'DESC';
  //
  //   const pageSize: number = query.pageSize ? +query.pageSize : 10;
  //   const pageNumber: number = query.pageNumber ? +query.pageNumber : 1;
  //
  //   const skip: number = pageSize * (pageNumber - 1);
  //
  //   const [items, totalCount] = await this.postsRepository.findAndCount({
  //     relations: {
  //       blog: true,
  //       postLikes: { user: { userBanInfo: true } },
  //     },
  //     where: {
  //       blog: {
  //         isBanned: false,
  //         id: blogId,
  //       },
  //     },
  //     order: {
  //       [`${sortBy}`]: sortDirection,
  //     },
  //     skip: skip,
  //     take: pageSize,
  //   });
  //
  //   return { items, totalCount };
  // }
}
