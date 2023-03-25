import {
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { CreateBlogDto } from './dto/createBlog.dto';
import { postToOutputModel } from '../../posts/models/postsToViewModel';
import {
  blogsToOutputModel,
  blogToOutputModel,
} from '../models/blogsToViewModel';
import { UpdateBlogDto } from './dto/updateBlog.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { GetCurrentATJwtContext } from '../../../shared/decorators/get-At-current-user.decorator';
import { JwtATPayload } from '../../auth/interfaces/jwtPayload.type';
import { CommandBus } from '@nestjs/cqrs';
import { BlogsService } from '../blogs.service';
import { UpdateBlogCommand } from '../use-cases/updateBlog.useCase';
import { DeleteBlogCommand } from '../use-cases/deleteBlog.useCase';
import { CreateBlogCommand } from '../use-cases/createBlog.useCase';
import { CreateBlogPostCommand } from '../use-cases/createBlogPost.useCase';
import { CreatePostDto } from './dto/createPost.dto';
import { UpdatePostDto } from './dto/updatePost.dto';
import { PostsService } from '../../posts/posts.service';
import { UpdateBlogPostCommand } from '../use-cases/updateBlogPost.useCase';
import { DeleteBlogPostCommand } from '../use-cases/deleteBlogPost.useCase';
import { blogsQueryModel } from '../models/blogsQueryModel';
import { BlogsQueryRepository } from '../blogsQuery.repository';
import { BlogsCommentsQueryModel } from '../models/blogsCommentsQueryModel';
import { AllBloggerCommentsQueryRepository } from '../../comments/allBloggerCommentsQuery.repository';

@Controller('blogger/blogs')
export class BlogsBloggerController {
  constructor(
    private commandBus: CommandBus,
    private blogsService: BlogsService,
    private postsService: PostsService,
    private blogsQueryRepository: BlogsQueryRepository,
    private allBloggerCommentsQueryRepository: AllBloggerCommentsQueryRepository,
  ) {}

  // Update Blog by Id
  @Put(':id')
  @UseGuards(JwtAuthGuard)
  @HttpCode(204)
  async updateBlog(
    @Param('id') id: string,
    @Body() updateBlogDto: UpdateBlogDto,
    @GetCurrentATJwtContext() jwtATPayload: JwtATPayload,
  ) {
    const blog = await this.blogsService.getBlogById(id);

    if (!blog) {
      throw new NotFoundException('no such blog');
    }

    if (blog.userId !== jwtATPayload.user.userId) {
      throw new ForbiddenException();
    }

    return await this.commandBus.execute(
      new UpdateBlogCommand(blog, updateBlogDto),
    );
  }

  // Delete Blog by Id
  @Delete(':blogId')
  @UseGuards(JwtAuthGuard)
  @HttpCode(204)
  async delete(
    @Param('blogId') blogId: string,
    @GetCurrentATJwtContext() jwtATPayload: JwtATPayload,
  ) {
    const blog = await this.blogsService.getBlogById(blogId);

    if (!blog) {
      throw new NotFoundException('no such blog');
    }

    if (blog.userId !== jwtATPayload.user.userId) {
      throw new ForbiddenException();
    }

    return await this.commandBus.execute(new DeleteBlogCommand(blogId));
  }

  // Create Blog
  @Post()
  @UseGuards(JwtAuthGuard)
  async createBlog(
    @Body() createBlogDto: CreateBlogDto,
    @GetCurrentATJwtContext() jwtATPayload: JwtATPayload,
  ) {
    const newBlog = await this.commandBus.execute(
      new CreateBlogCommand(
        createBlogDto,
        jwtATPayload.user.userId,
        jwtATPayload.user.login,
      ),
    );
    return blogToOutputModel(newBlog);
  }

  // Return all User's blogs
  @Get()
  @UseGuards(JwtAuthGuard)
  async getAllBlogs(
    @Query() query: blogsQueryModel,
    @GetCurrentATJwtContext() jwtATPayload: JwtATPayload,
  ) {
    const result = await this.blogsQueryRepository.getAllBlogs(
      query,
      [],
      jwtATPayload.user.userId,
    );

    return blogsToOutputModel(query, result.items, result.totalCount, []);
  }

  //  Create new post for blog
  @Post(':blogId/posts')
  @UseGuards(JwtAuthGuard)
  async createBlogPost(
    @Param('blogId') blogId: string,
    @Body() createPostDto: CreatePostDto,
    @GetCurrentATJwtContext() jwtATPayload: JwtATPayload,
  ) {
    const blog = await this.blogsService.getBlogById(blogId);

    if (!blog) {
      throw new NotFoundException('no such blog');
    }

    if (blog.userId !== jwtATPayload.user.userId) {
      throw new ForbiddenException();
    }

    const newPost = await this.commandBus.execute(
      new CreateBlogPostCommand(
        createPostDto,
        blogId,
        jwtATPayload.user.userId,
      ),
    );

    return postToOutputModel(newPost, jwtATPayload.user.userId, []);
  }

  //  Update post
  @Put(':blogId/posts/:postId')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  async updatePost(
    @Param('blogId') blogId: string,
    @Param('postId') postId: string,
    @Body() updatePostDto: UpdatePostDto,
    @GetCurrentATJwtContext() jwtATPayload: JwtATPayload,
  ) {
    const blog = await this.blogsService.getBlogById(blogId);

    if (!blog) {
      throw new NotFoundException('no such blog');
    }

    const post = await this.postsService.getPostById(postId);

    if (!post) {
      throw new NotFoundException('no such blog');
    }

    if (post.userId !== jwtATPayload.user.userId) {
      throw new ForbiddenException();
    }

    await this.commandBus.execute(
      new UpdateBlogPostCommand(post, updatePostDto),
    );
  }

  //  Delete post
  @Delete(':blogId/posts/:postId')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  async deletePost(
    @Param('blogId') blogId: string,
    @Param('postId') postId: string,
    @GetCurrentATJwtContext() jwtATPayload: JwtATPayload,
  ) {
    const blog = await this.blogsService.getBlogById(blogId);

    if (!blog) {
      throw new NotFoundException('no such blog');
    }

    const post = await this.postsService.getPostById(postId);

    if (!post) {
      throw new NotFoundException('no such blog');
    }

    if (post.userId !== jwtATPayload.user.userId) {
      throw new ForbiddenException();
    }

    await this.commandBus.execute(new DeleteBlogPostCommand(postId));
  }

  /// Comments

  @Get('comments')
  @UseGuards(JwtAuthGuard)
  async getAllCommentsForBlogs(
    @Query() blogsCommentsQueryModel: BlogsCommentsQueryModel,
    @GetCurrentATJwtContext() jwtATPayload: JwtATPayload,
  ) {
    const allUsersPosts = await this.postsService.getAllBloggerPosts(
      jwtATPayload.user.userId,
    );

    const allComments =
      await this.allBloggerCommentsQueryRepository.getAllBloggerPostComments(
        blogsCommentsQueryModel,
        jwtATPayload.user.userId,
        allUsersPosts,
      );

    return this.allBloggerCommentsQueryRepository.allBloggerPostsCommentsToOutputModel(
      blogsCommentsQueryModel,
      allComments.items,
      allComments.totalCount,
    );
  }
}