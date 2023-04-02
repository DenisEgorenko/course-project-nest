import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Blog, BlogModel } from '../infrastructure/mongo/model/blogs.schema';
import { InjectModel } from '@nestjs/mongoose';
import { IBlogsRepository } from '../core/abstracts/blogs.repository.abstract';

export class DeleteBlogCommand {
  constructor(public readonly blogId: string) {}
}

@CommandHandler(DeleteBlogCommand)
export class DeleteBlogHandler implements ICommandHandler<DeleteBlogCommand> {
  constructor(protected blogsRepository: IBlogsRepository) {}

  async execute(command: DeleteBlogCommand) {
    const { blogId } = command;

    const deletedBlog = await this.blogsRepository.deleteBlogById(blogId);

    return deletedBlog;
  }
}
