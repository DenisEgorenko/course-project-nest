import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { SetLikeStatusDto } from '../../posts/dto/setLikeStatusDto';
import { IUsersRepository } from '../../users/core/abstracts/users.repository.abstract';
import { ICommentsRepository } from '../core/abstracts/comments.repository.abstract';
import { ICommentsLikesRepository } from '../core/abstracts/commentsLikes.repository.abstract';
import { CommentLike } from '../infrastructure/postgreSql/model/comments.entity';

export class SetCommentLikeStatusCommand {
  constructor(
    public readonly setLikeStatusDto: SetLikeStatusDto,
    public readonly commentId: string,
    public readonly userId: string,
  ) {}
}

@CommandHandler(SetCommentLikeStatusCommand)
export class SetCommentLikeStatusHandler
  implements ICommandHandler<SetCommentLikeStatusCommand>
{
  constructor(
    protected commentsLikesRepository: ICommentsLikesRepository,
    protected usersRepository: IUsersRepository,
    protected commentsRepository: ICommentsRepository,
  ) {}
  async execute(command: SetCommentLikeStatusCommand) {
    const { setLikeStatusDto, commentId, userId } = command;

    const comment = await this.commentsRepository.getCommentById(commentId);

    const user = await this.usersRepository.findUserByUserId(userId);

    const commentLike = await this.commentsLikesRepository.getCommentLike(
      commentId,
      userId,
    );

    if (!commentLike) {
      const newCommentLike = new CommentLike();
      newCommentLike.likeStatus = setLikeStatusDto.likeStatus;
      newCommentLike.createdAt = new Date();
      newCommentLike.comment = comment;
      newCommentLike.user = user;

      return await this.commentsLikesRepository.save(newCommentLike);
    }

    if (setLikeStatusDto.likeStatus === 'None') {
      return await this.commentsLikesRepository.deleteCommentLike(
        commentId,
        userId,
      );
    }

    commentLike.likeStatus = setLikeStatusDto.likeStatus;
    commentLike.createdAt = new Date();

    return await this.commentsLikesRepository.save(commentLike);
  }
}
