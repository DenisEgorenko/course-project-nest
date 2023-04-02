import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectModel } from '@nestjs/mongoose';
import {
  Post,
  PostDocument,
  PostModel,
} from '../../posts/infrastructure/mongo/model/post.schema';
import { CreatePostDto } from '../controllers/dto/createPost.dto';
import { UpdatePostDto } from '../controllers/dto/updatePost.dto';
import { IPostsRepository } from '../../posts/core/abstracts/posts.repository.abstract';

export class DeleteBlogPostCommand {
  constructor(public readonly postId: string) {}
}

@CommandHandler(DeleteBlogPostCommand)
export class DeleteBlogPostHandler
  implements ICommandHandler<DeleteBlogPostCommand>
{
  constructor(protected postsRepository: IPostsRepository) {}
  async execute(command: DeleteBlogPostCommand): Promise<any> {
    const { postId } = command;

    return this.postsRepository.deletePostById(postId);
  }
}
