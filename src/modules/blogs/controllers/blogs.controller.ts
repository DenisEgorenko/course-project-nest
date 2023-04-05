import {
  Controller,
  Get,
  NotFoundException,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { BlogsService } from '../blogs.service';
import { blogsQueryModel } from '../models/blogsQueryModel';
import { PostsQueryRepository } from '../../posts/postsQuery.repository';
import { PostsQueryModel } from '../../posts/models/postsQueryModel';
import { AuthGuardForLikes } from '../../auth/guards/auth-guard-for-likes.guard';
import { GetCurrentRTJwtContext } from '../../../shared/decorators/get-Rt-current-user.decorator';
import { JwtRTPayload } from '../../auth/interfaces/jwtPayload.type';
import {
  blogsToOutputModel,
  blogToOutputModel,
} from '../models/blogsToViewModel';
import { postsToOutputModel } from '../../posts/models/postsToViewModel';
import { PostsService } from '../../posts/posts.service';

@Controller('blogs')
export class BlogsController {
  constructor(
    protected blogsService: BlogsService,
    protected postsService: PostsService,
    protected postsQueryRepository: PostsQueryRepository,
  ) {}

  @Get()
  async getAllBlogs(@Query() query: blogsQueryModel) {
    const result = await this.blogsService.getAllBlogs(query, false);

    return blogsToOutputModel(query, result.items, result.totalCount);
  }

  @Get(':blogId')
  async getBlogById(@Param('blogId') blogId: string) {
    const blog = await this.blogsService.getBlogById(blogId);

    if (!blog) {
      throw new NotFoundException();
    }

    if (blog.isBanned) {
      throw new NotFoundException();
    }
    return blogToOutputModel(blog);
  }

  @Get(':blogId/posts')
  @UseGuards(AuthGuardForLikes)
  async getBlogPosts(
    @Param('blogId') blogId: string,
    @Query() query: PostsQueryModel,
    @GetCurrentRTJwtContext() jwtRTPayload: JwtRTPayload,
  ) {
    const blog = await this.blogsService.getBlogById(blogId);

    if (!blog) {
      throw new NotFoundException();
    }

    const items = await this.postsService.getAllPosts(query, blogId);

    return postsToOutputModel(
      query,
      items.items,
      items.totalCount,
      jwtRTPayload.user.userId,
    );
  }
}
