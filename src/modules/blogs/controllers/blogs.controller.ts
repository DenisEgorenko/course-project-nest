import {
  Controller,
  Get,
  NotFoundException,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { BlogsService } from '../blogs.service';
import { BlogsQueryRepository } from '../blogsQuery.repository';
import { blogsQueryModel } from '../models/blogsQueryModel';
import { PostsQueryRepository } from '../../posts/postsQuery.repository';
import { postsQueryModel } from '../../posts/models/postsQueryModel';
import { PostsService } from '../../posts/posts.service';
import { AuthGuardForLikes } from '../../auth/guards/auth-guard-for-likes.guard';
import { GetCurrentRTJwtContext } from '../../../shared/decorators/get-Rt-current-user.decorator';
import { JwtRTPayload } from '../../auth/interfaces/jwtPayload.type';
import {
  blogsToOutputModel,
  blogToOutputModel,
} from '../models/blogsToViewModel';

@Controller('blogs')
export class BlogsController {
  constructor(
    protected blogsService: BlogsService,
    protected postService: PostsService,
    protected blogsQueryRepository: BlogsQueryRepository,
    protected postsQueryRepository: PostsQueryRepository,
  ) {}

  @Get()
  async getAllBlogs(@Query() query: blogsQueryModel) {
    const result = await this.blogsQueryRepository.getAllBlogs(query);

    return blogsToOutputModel(query, result.items, result.totalCount);
  }

  @Get(':id')
  async getBlogById(@Param('id') id: string) {
    const blog = await this.blogsService.getBlogById(id);

    if (!blog) {
      throw new NotFoundException();
    }
    return blogToOutputModel(blog);
  }

  @Get(':id/posts')
  @UseGuards(AuthGuardForLikes)
  async getBlogPosts(
    @Param('id') id: string,
    @Query() query: postsQueryModel,
    @GetCurrentRTJwtContext() jwtRTPayload: JwtRTPayload,
  ) {
    const blog = await this.blogsService.getBlogById(id);

    if (!blog) {
      throw new NotFoundException();
    }

    return await this.postsQueryRepository.getAllBlogsPosts(
      id,
      query,
      jwtRTPayload.user.userId,
    );
  }
}
