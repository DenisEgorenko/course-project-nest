import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { CreateBlogDto } from './dto/createBlog.dto';
import { BlogsService } from './blogs.service';
import { BlogsQueryRepository } from './blogsQuery.repository';
import { blogsQueryModel } from './models/blogsQueryModel';
import { UpdateBlogDto } from './dto/updateBlog.dto';
import { PostsQueryRepository } from '../../posts/postsQuery.repository';
import { postsQueryModel } from '../../posts/models/postsQueryModel';
import { CreatePostDto } from '../../posts/dto/createPost.dto';
import { PostsService } from '../../posts/posts.service';
import { CreatePostBlogDto } from '../../posts/dto/createPostBlog.dto';

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
    return await this.blogsService.getBlogById(id);
  }

  @Get(':id/posts')
  async getBlogPosts(@Param('id') id: string, @Query() query: postsQueryModel) {
    return await this.postsQueryRepository.getAllBlogsPosts(id, query, '');
  }
  @Post()
  async createBlog(@Body() createBlogDto: CreateBlogDto) {
    const newBlog = await this.blogsService.createBlog(createBlogDto);
    return newBlog;
  }

  @Post(':id/posts')
  async createBlogPost(
    @Param('id') id: string,
    @Body() createPostBlogDto: CreatePostBlogDto,
  ) {
    const newBlog = await this.postService.createPostBlog(
      createPostBlogDto,
      id,
      '',
    );
    return newBlog;
  }

  @Put(':id')
  async updateBlog(
    @Param('id') id: string,
    @Body() updateBlogDto: UpdateBlogDto,
  ) {
    return this.blogsService.updateBlog(id, updateBlogDto);
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    return this.blogsService.deleteBlog(id);
  }
}
