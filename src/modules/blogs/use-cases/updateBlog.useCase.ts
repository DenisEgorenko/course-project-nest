import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UpdateBlogDto } from '../controllers/dto/updateBlog.dto';
import { BlogBaseEntity } from '../core/entity/blog.entity';
import { IBlogsRepository } from '../core/abstracts/blogs.repository.abstract';

export class UpdateBlogCommand {
  constructor(
    public readonly blogId: string,
    public readonly updateBlogDto: UpdateBlogDto,
  ) {}
}

@CommandHandler(UpdateBlogCommand)
export class UpdateBlogHandler implements ICommandHandler<UpdateBlogCommand> {
  constructor(protected blogsRepository: IBlogsRepository) {}
  async execute(command: UpdateBlogCommand) {
    const { blogId, updateBlogDto } = command;

    const blog = await this.blogsRepository.getBlogById(blogId);

    blog.setName(updateBlogDto.name);
    blog.setDescription(updateBlogDto.description);
    blog.setWebsiteUrl(updateBlogDto.websiteUrl);

    return await this.blogsRepository.save(blog);
  }
}
