import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import {
  Blog,
  BlogDocument,
  BlogModel,
} from '../../../db/schemas/blogs.schema';
import { UpdateBlogDto } from '../controllers/dto/updateBlog.dto';
import { InjectModel } from '@nestjs/mongoose';

export class DeleteBlogCommand {
  constructor(public readonly blogId: string) {}
}

@CommandHandler(DeleteBlogCommand)
export class DeleteBlogHandler implements ICommandHandler<DeleteBlogCommand> {
  constructor(
    @InjectModel(Blog.name)
    protected blogModel: BlogModel,
  ) {}
  async execute(command: DeleteBlogCommand) {
    const { blogId } = command;

    const deletedBlog = await this.blogModel.deleteOne({ id: blogId });

    return deletedBlog;
  }
}
