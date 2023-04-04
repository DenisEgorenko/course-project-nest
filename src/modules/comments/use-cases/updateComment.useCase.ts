import { CreateCommentDto } from '../dto/createComment.dto';
import { IPostsRepository } from '../../posts/core/abstracts/posts.repository.abstract';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { IUsersRepository } from '../../users/core/abstracts/users.repository.abstract';
import { ICommentsRepository } from '../core/abstracts/comments.repository.abstract';
import { Comment } from '../infrastructure/postgreSql/model/comments.entity';
import { UpdateCommentDto } from '../dto/updateComment.dto';

export class UpdateCommentCommand {
  constructor(
    public readonly updateCommentDto: UpdateCommentDto,
    public readonly commentId: string,
  ) {}
}

@CommandHandler(UpdateCommentCommand)
export class UpdateCommentHandler
  implements ICommandHandler<UpdateCommentCommand>
{
  constructor(protected commentsRepository: ICommentsRepository) {}
  async execute(command: UpdateCommentCommand) {
    const { updateCommentDto, commentId } = command;

    const comment = await this.commentsRepository.getCommentById(commentId);

    comment.content = updateCommentDto.content;

    return await this.commentsRepository.save(comment);
  }
}
