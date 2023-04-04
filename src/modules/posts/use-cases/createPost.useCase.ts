import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { IBlogsRepository } from '../../blogs/core/abstracts/blogs.repository.abstract';
import { Post } from '../infrastructure/postgreSql/model/post.entity';
import { CreatePostDto } from '../../blogs/controllers/dto/createPost.dto';
import { IPostsRepository } from '../core/abstracts/posts.repository.abstract';

export class CreatePostCommand {
  constructor(
    public readonly createPostDto: CreatePostDto,
    public readonly blogId: string,
  ) {}
}

@CommandHandler(CreatePostCommand)
export class CreatePostHandler implements ICommandHandler<CreatePostCommand> {
  constructor(
    protected blogsRepository: IBlogsRepository,
    protected postsRepository: IPostsRepository,
  ) {}
  async execute(command: CreatePostCommand) {
    const { createPostDto, blogId } = command;

    const blog = await this.blogsRepository.getBlogById(blogId);

    const newPost = new Post();

    newPost.createdAt = new Date();
    newPost.title = createPostDto.title;
    newPost.shortDescription = createPostDto.shortDescription;
    newPost.content = createPostDto.content;

    newPost.blog = blog;

    return await this.postsRepository.save(newPost);
  }
}
