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
import { AuthGuardForLikes } from '../../auth/guards/auth-guard-for-likes.guard';
import { GetCurrentRTJwtContext } from '../../../shared/decorators/get-Rt-current-user.decorator';
import { JwtRTPayload } from '../../auth/interfaces/jwtPayload.type';
import {
  blogsToOutputModel,
  blogToOutputModel,
} from '../models/blogsToViewModel';
import { postsToOutputModel } from '../../posts/models/postsToViewModel';
import { UsersService } from '../../users/services/users.service';

@Controller('blogs')
export class BlogsController {
  constructor(
    protected blogsService: BlogsService,
    protected usersService: UsersService,
    protected blogsQueryRepository: BlogsQueryRepository,
    protected postsQueryRepository: PostsQueryRepository,
  ) {}

  @Get()
  async getAllBlogs(@Query() query: blogsQueryModel) {
    const bannedBlogs = await this.blogsService.getAllBannedBlogsIds();

    const result = await this.blogsQueryRepository.getAllBlogs(
      query,
      bannedBlogs,
    );

    return blogsToOutputModel(
      query,
      result.items,
      result.totalCount,
      bannedBlogs,
    );
  }

  @Get(':id')
  async getBlogById(@Param('id') id: string) {
    const blog = await this.blogsService.getBlogById(id);

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
    @Query() query: postsQueryModel,
    @GetCurrentRTJwtContext() jwtRTPayload: JwtRTPayload,
  ) {
    const blog = await this.blogsService.getBlogById(blogId);

    if (!blog) {
      throw new NotFoundException();
    }

    const bannedUsers = await this.usersService.getAllBannedUsersIds();

    const items = await this.postsQueryRepository.getAllPosts(
      query,
      jwtRTPayload.user.userId,
      bannedUsers,
      blogId,
    );

    return postsToOutputModel(
      query,
      items.items,
      items.totalCount,
      jwtRTPayload.user.userId,
      bannedUsers,
    );
  }
}
