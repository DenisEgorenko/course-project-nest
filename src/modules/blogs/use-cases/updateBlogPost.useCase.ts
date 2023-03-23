import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectModel } from '@nestjs/mongoose';
import { Post, PostDocument, PostModel } from '../../../db/schemas/post.schema';
import { CreatePostDto } from '../controllers/dto/createPost.dto';
import { UpdatePostDto } from '../controllers/dto/updatePost.dto';

export class UpdateBlogPostCommand {
  constructor(
    public readonly post: PostDocument,
    public readonly updatePostDto: UpdatePostDto,
  ) {}
}

@CommandHandler(UpdateBlogPostCommand)
export class UpdateBlogPostHandler
  implements ICommandHandler<UpdateBlogPostCommand>
{
  constructor(
    @InjectModel(Post.name)
    protected postModel: PostModel,
  ) {}
  async execute(command: UpdateBlogPostCommand): Promise<PostDocument> {
    const { post, updatePostDto } = command;

    post.setTitle(updatePostDto.title);
    post.setShortDescription(updatePostDto.shortDescription);
    post.setContent(updatePostDto.content);
    return await post.save();
  }
}
