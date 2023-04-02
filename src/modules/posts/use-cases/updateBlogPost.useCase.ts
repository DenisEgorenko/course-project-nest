import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { PostDocument } from '../infrastructure/mongo/model/post.schema';
import { UpdatePostDto } from '../../blogs/controllers/dto/updatePost.dto';
import { IPostsRepository } from '../core/abstracts/posts.repository.abstract';

export class UpdateBlogPostCommand {
  constructor(
    public readonly postId: string,
    public readonly updatePostDto: UpdatePostDto,
  ) {}
}

@CommandHandler(UpdateBlogPostCommand)
export class UpdateBlogPostHandler
  implements ICommandHandler<UpdateBlogPostCommand>
{
  constructor(protected postsRepository: IPostsRepository) {}
  async execute(command: UpdateBlogPostCommand): Promise<PostDocument> {
    const { postId, updatePostDto } = command;

    const post = await this.postsRepository.getPostById(postId);

    post.setTitle(updatePostDto.title);
    post.setShortDescription(updatePostDto.shortDescription);
    post.setContent(updatePostDto.content);

    return await this.postsRepository.save(post);
  }
}
