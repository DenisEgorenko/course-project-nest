import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { IPostsRepository } from '../../core/abstracts/posts.repository.abstract';
import { Post } from './model/post.entity';
import { PostBaseEntity } from '../../core/entity/postBase.entity';

@Injectable()
export class PostsSqlRepository implements IPostsRepository {
  constructor(
    @InjectRepository(Post)
    protected postsRepository: Repository<Post>,
  ) {}

  async save(post: PostBaseEntity) {
    return this.postsRepository.save(post);
  }
  async getPostById(postId: string): Promise<Post> {
    return this.postsRepository.findOne({
      relations: {
        blog: { user: true },
      },
      where: {
        id: postId,
      },
    });
  }

  async deletePostById(postId: string) {
    return await this.postsRepository.delete({ id: postId });
  }
}
