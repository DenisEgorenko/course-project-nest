import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import {
  Blog,
  BlogDocument,
  BlogModel,
} from '../../../db/schemas/blogs.schema';
import { UpdateBlogDto } from '../controllers/dto/updateBlog.dto';
import { CreateBlogDto } from '../controllers/dto/createBlog.dto';
import { InjectModel } from '@nestjs/mongoose';

export class CreateBlogCommand {
  constructor(
    public readonly createBlogDto: CreateBlogDto,
    public readonly userId: string,
    public readonly userLogin: string,
  ) {}
}

@CommandHandler(CreateBlogCommand)
export class CreateBlogHandler implements ICommandHandler<CreateBlogCommand> {
  constructor(
    @InjectModel(Blog.name)
    protected blogModel: BlogModel,
  ) {}
  async execute(command: CreateBlogCommand): Promise<BlogDocument> {
    const { createBlogDto, userId, userLogin } = command;
    const newBlog = await this.blogModel.createBlog(
      createBlogDto.name,
      createBlogDto.description,
      createBlogDto.websiteUrl,
      this.blogModel,
      userId,
      userLogin,
    );

    return await newBlog.save();
  }
}
