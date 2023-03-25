import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectModel } from '@nestjs/mongoose';
import { Post, PostDocument, PostModel } from '../../../db/schemas/post.schema';
import { CreatePostDto } from '../controllers/dto/createPost.dto';
import { UpdatePostDto } from '../controllers/dto/updatePost.dto';
import { BlogDocument } from '../../../db/schemas/blogs.schema';
import { BanStatusDto } from '../controllers/dto/banStatus.dto';

export class BanBlogCommand {
  constructor(
    public readonly blog: BlogDocument,
    public readonly banStatusDto: BanStatusDto,
  ) {}
}

@CommandHandler(BanBlogCommand)
export class BanBlogHandler implements ICommandHandler<BanBlogCommand> {
  constructor(
    @InjectModel(Post.name)
    protected postModel: PostModel,
  ) {}
  async execute(command: BanBlogCommand): Promise<BlogDocument> {
    const { blog, banStatusDto } = command;

    if (banStatusDto.isBanned) {
      blog.setIsBanned(banStatusDto.isBanned);
      blog.setBannedDate(new Date());
    } else {
      blog.setIsBanned(banStatusDto.isBanned);
      blog.setBannedDate(null);
    }

    return await blog.save();
  }
}
