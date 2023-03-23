import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { BlogDocument } from '../../../db/schemas/blogs.schema';
import { UpdateBlogDto } from '../controllers/dto/updateBlog.dto';

export class UpdateBlogCommand {
  constructor(
    public readonly blog: BlogDocument,
    public readonly updateBlogDto: UpdateBlogDto,
  ) {}
}

@CommandHandler(UpdateBlogCommand)
export class UpdateBlogHandler implements ICommandHandler<UpdateBlogCommand> {
  async execute(command: UpdateBlogCommand) {
    const { blog, updateBlogDto } = command;

    blog.setName(updateBlogDto.name);
    blog.setDescription(updateBlogDto.description);
    blog.setWebsiteUrl(updateBlogDto.websiteUrl);

    return await blog.save();
  }
}
