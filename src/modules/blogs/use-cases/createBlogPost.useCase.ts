import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectModel } from '@nestjs/mongoose';
import { Post, PostDocument, PostModel } from '../../../db/schemas/post.schema';
import { CreatePostDto } from '../controllers/dto/createPost.dto';

export class CreateBlogPostCommand {
  constructor(
    public readonly createPostDto: CreatePostDto,
    public readonly blogId: string,
    public readonly userId: string,
  ) {}
}

@CommandHandler(CreateBlogPostCommand)
export class CreateBlogPostHandler
  implements ICommandHandler<CreateBlogPostCommand>
{
  constructor(
    @InjectModel(Post.name)
    protected postModel: PostModel,
  ) {}
  async execute(command: CreateBlogPostCommand): Promise<PostDocument> {
    const { createPostDto, blogId, userId } = command;

    const newPost = await this.postModel.createPost(
      createPostDto.title,
      createPostDto.shortDescription,
      createPostDto.content,
      blogId,
      userId,
      this.postModel,
    );

    return await newPost.save();
  }
}
