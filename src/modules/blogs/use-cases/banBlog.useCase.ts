import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { BlogDocument } from '../infrastructure/mongo/model/blogs.schema';
import { BanStatusDto } from '../controllers/dto/banStatus.dto';
import { BlogBaseEntity } from '../core/entity/blog.entity';
import { IBlogsRepository } from '../core/abstracts/blogs.repository.abstract';

export class BanBlogCommand {
  constructor(
    public readonly blogId: string,
    public readonly banStatusDto: BanStatusDto,
  ) {}
}

@CommandHandler(BanBlogCommand)
export class BanBlogHandler implements ICommandHandler<BanBlogCommand> {
  constructor(protected blogsRepository: IBlogsRepository) {}
  async execute(command: BanBlogCommand): Promise<BlogDocument> {
    const { blogId, banStatusDto } = command;

    const blog = await this.blogsRepository.getBlogById(blogId);

    if (banStatusDto.isBanned) {
      blog.setIsBanned(banStatusDto.isBanned);
      blog.setBannedDate(new Date());
    } else {
      blog.setIsBanned(banStatusDto.isBanned);
      blog.setBannedDate(null);
    }

    return await this.blogsRepository.save(blog);
  }
}
