import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateBlogDto } from '../controllers/dto/createBlog.dto';
import { BlogBaseEntity } from '../core/entity/blog.entity';
import { IUsersRepository } from '../../users/core/abstracts/users.repository.abstract';
import { IBlogsRepository } from '../core/abstracts/blogs.repository.abstract';
import { Blog } from '../infrastructure/postgreSql/model/blog.entity';

export class CreateBlogCommand {
  constructor(
    public readonly createBlogDto: CreateBlogDto,
    public readonly userId: string,
  ) {}
}

@CommandHandler(CreateBlogCommand)
export class CreateBlogHandler implements ICommandHandler<CreateBlogCommand> {
  constructor(
    protected usersRepository: IUsersRepository,
    protected blogsRepository: IBlogsRepository,
  ) {}
  async execute(command: CreateBlogCommand) {
    const { createBlogDto, userId } = command;

    const user = await this.usersRepository.findUserByUserId(userId);

    const newBlog = new Blog();
    newBlog.createdAt = new Date();
    newBlog.name = createBlogDto.name;
    newBlog.description = createBlogDto.description;
    newBlog.websiteUrl = createBlogDto.websiteUrl;
    newBlog.isBanned = false;
    newBlog.banDate = null;

    newBlog.user = user;

    return await this.blogsRepository.save(newBlog);
  }
}
