import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  NotFoundException,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { CreateBlogDto } from './dto/createBlog.dto';
import { BlogsService } from './blogs.service';
import { BlogsQueryRepository } from './blogsQuery.repository';
import { blogsQueryModel } from './models/blogsQueryModel';
import { UpdateBlogDto } from './dto/updateBlog.dto';
import { PostsQueryRepository } from '../posts/postsQuery.repository';
import { postsQueryModel } from '../posts/models/postsQueryModel';
import { CreatePostDto } from '../posts/dto/createPost.dto';
import { PostsService } from '../posts/posts.service';
import { CreatePostBlogDto } from '../posts/dto/createPostBlog.dto';
import { BasicAuthGuard } from '../auth/guards/basic-auth.guard';
import { BlogDocument } from './schema/blogs.schema';
import { postToOutputModel } from '../posts/models/postsToViewModel';
import { JwtRefreshAuthGuard } from '../auth/guards/jwt-refresh-auth.guard';
import { GetCurrentRTJwtContext } from '../../shared/decorators/get-Rt-current-user.decorator';
import { JwtRTPayload } from '../auth/interfaces/jwtPayload.type';
import { blogToOutputModel } from './models/blogsToViewModel';
import { find } from 'rxjs';

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
    return await this.blogsQueryRepository.getAllBlogs(query);
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
  @UseGuards(JwtRefreshAuthGuard)
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
  @Post()
  @UseGuards(BasicAuthGuard)
  async createBlog(@Body() createBlogDto: CreateBlogDto) {
    const newBlog = await this.blogsService.createBlog(createBlogDto);
    return blogToOutputModel(newBlog);
  }

  @Post(':id/posts')
  @UseGuards(BasicAuthGuard)
  async createBlogPost(
    @Param('id') id: string,
    @Body() createPostBlogDto: CreatePostBlogDto,
  ) {
    const blog = await this.blogsService.getBlogById(id);

    if (!blog) {
      throw new NotFoundException('no such blog');
    }

    const newPost = await this.postService.createBlogPost(
      createPostBlogDto,
      id,
    );
    return postToOutputModel(newPost, '');
  }

  @Put(':id')
  @UseGuards(BasicAuthGuard)
  @HttpCode(204)
  async updateBlog(
    @Param('id') id: string,
    @Body() updateBlogDto: UpdateBlogDto,
  ) {
    const blog = await this.blogsService.getBlogById(id);

    if (!blog) {
      throw new NotFoundException('no such blog');
    }

    return this.blogsService.updateBlog(blog, updateBlogDto);
  }

  @Delete(':id')
  @UseGuards(BasicAuthGuard)
  @HttpCode(204)
  async delete(@Param('id') id: string) {
    const blog = await this.blogsService.getBlogById(id);

    if (!blog) {
      throw new NotFoundException('no such blog');
    }

    return this.blogsService.deleteBlog(id);
  }
}
