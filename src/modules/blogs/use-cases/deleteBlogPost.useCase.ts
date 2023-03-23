import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectModel } from '@nestjs/mongoose';
import { Post, PostDocument, PostModel } from '../../../db/schemas/post.schema';
import { CreatePostDto } from '../controllers/dto/createPost.dto';
import { UpdatePostDto } from '../controllers/dto/updatePost.dto';

export class DeleteBlogPostCommand {
  constructor(public readonly postId: string) {}
}

@CommandHandler(DeleteBlogPostCommand)
export class DeleteBlogPostHandler
  implements ICommandHandler<DeleteBlogPostCommand>
{
  constructor(
    @InjectModel(Post.name)
    protected postModel: PostModel,
  ) {}
  async execute(command: DeleteBlogPostCommand): Promise<any> {
    const { postId } = command;

    return this.postModel.deleteOne({ id: postId });
  }
}
