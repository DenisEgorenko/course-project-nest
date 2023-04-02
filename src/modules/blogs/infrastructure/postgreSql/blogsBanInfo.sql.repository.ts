import { IBlogsBanInfoRepository } from '../../core/abstracts/blogsBanInfo.repository.abstract';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BlogsBanInfo } from '../../../users/infrastructure/postgreSql/model/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class BlogsBanInfoSqlRepository implements IBlogsBanInfoRepository {
  constructor(
    @InjectRepository(BlogsBanInfo)
    protected blogsBanInfoRepository: Repository<BlogsBanInfo>,
  ) {}

  async save(blogBanInfo: BlogsBanInfo) {
    return this.blogsBanInfoRepository.save(blogBanInfo);
  }

  async findBanInfo(userId: string, blogId: string) {
    return this.blogsBanInfoRepository.findOne({
      relations: {
        user: true,
        blog: true,
      },
      where: {
        user: { id: userId },
        blog: { id: blogId },
      },
    });
  }
}
