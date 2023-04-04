import { CreateCommentDto } from '../dto/createComment.dto';
import { IPostsRepository } from '../../posts/core/abstracts/posts.repository.abstract';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { IUsersRepository } from '../../users/core/abstracts/users.repository.abstract';
import { ICommentsRepository } from '../core/abstracts/comments.repository.abstract';
import { Comment } from '../infrastructure/postgreSql/model/comments.entity';

export class CreateCommentCommand {
  constructor(
    public readonly createCommentDto: CreateCommentDto,
    public readonly postId: string,
    public readonly userId: string,
  ) {}
}

@CommandHandler(CreateCommentCommand)
export class CreateCommentHandler
  implements ICommandHandler<CreateCommentCommand>
{
  constructor(
    protected usersRepository: IUsersRepository,
    protected postsRepository: IPostsRepository,
    protected commentsRepository: ICommentsRepository,
  ) {}
  async execute(command: CreateCommentCommand) {
    const { createCommentDto, postId, userId } = command;

    const post = await this.postsRepository.getPostById(postId);
    const user = await this.usersRepository.findUserByUserId(userId);

    const newComment = new Comment();

    newComment.user = user;
    newComment.post = post;
    newComment.content = createCommentDto.content;
    newComment.createdAt = new Date();

    return await this.commentsRepository.save(newComment);
  }
}
