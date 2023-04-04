import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { IPostsRepository } from '../../core/abstracts/posts.repository.abstract';
import { Post, PostLike } from './model/post.entity';
import { PostBaseEntity } from '../../core/entity/postBase.entity';
import { IPostsLikesRepository } from '../../core/abstracts/postsLikes.repository.abstract';

@Injectable()
export class PostsLikesSqlRepository implements IPostsLikesRepository {
  constructor(
    @InjectRepository(PostLike)
    protected postLikesRepository: Repository<PostLike>,
  ) {}

  async save(post: PostLike) {
    return this.postLikesRepository.save(post);
  }

  async getPostLike(postId: string, userId: string) {
    return await this.postLikesRepository.findOne({
      relations: {
        post: true,
        user: true,
      },
      where: {
        post: { id: postId },
        user: { id: userId },
      },
    });
  }
  async deletePostLike(postId: string, userId: string) {
    return await this.postLikesRepository.delete({
      user: { id: userId },
      post: { id: postId },
    });
  }
}
