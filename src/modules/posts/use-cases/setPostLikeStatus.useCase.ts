import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { PostLike } from '../infrastructure/postgreSql/model/post.entity';
import { IPostsRepository } from '../core/abstracts/posts.repository.abstract';
import { SetLikeStatusDto } from '../dto/setLikeStatusDto';
import { IPostsLikesRepository } from '../core/abstracts/postsLikes.repository.abstract';
import { IUsersRepository } from '../../users/core/abstracts/users.repository.abstract';

export class SetPostLikeStatusCommand {
  constructor(
    public readonly setLikeStatusDto: SetLikeStatusDto,
    public readonly postId: string,
    public readonly userId: string,
  ) {}
}

@CommandHandler(SetPostLikeStatusCommand)
export class SetPostLikeStatusHandler
  implements ICommandHandler<SetPostLikeStatusCommand>
{
  constructor(
    protected postsLikesRepository: IPostsLikesRepository,
    protected usersRepository: IUsersRepository,
    protected postsRepository: IPostsRepository,
  ) {}
  async execute(command: SetPostLikeStatusCommand) {
    const { setLikeStatusDto, postId, userId } = command;

    const post = await this.postsRepository.getPostById(postId);

    const user = await this.usersRepository.findUserByUserId(userId);

    const postLike = await this.postsLikesRepository.getPostLike(
      postId,
      userId,
    );

    if (!postLike) {
      const newPostLike = new PostLike();
      newPostLike.likeStatus = setLikeStatusDto.likeStatus;
      newPostLike.createdAt = new Date();
      newPostLike.post = post;
      newPostLike.user = user;

      return await this.postsLikesRepository.save(newPostLike);
    }

    if (setLikeStatusDto.likeStatus === 'None') {
      return await this.postsLikesRepository.deletePostLike(postId, userId);
    }

    postLike.likeStatus = setLikeStatusDto.likeStatus;
    postLike.createdAt = new Date();

    return await this.postsLikesRepository.save(postLike);
  }
}
