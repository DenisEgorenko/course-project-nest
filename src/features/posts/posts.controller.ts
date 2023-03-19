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
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/createPost.dto';
import { UpdatePostDto } from './dto/updatePost.dto';
import { PostsQueryRepository } from './postsQuery.repository';
import { postsQueryModel } from './models/postsQueryModel';
import { commentsQueryModel } from '../comments/models/commentsQueryModel';
import {
  CommentsQueryRepository,
  commentToOutputModel,
} from '../comments/commentsQuery.repository';
import { CreateCommentDto } from '../comments/dto/createComment.dto';
import { CommentsService } from '../comments/comments.service';
import { SetLikeStatusDto } from './dto/setLikeStatusDto';
import { BasicAuthGuard } from '../auth/guards/basic-auth.guard';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { GetCurrentATJwtContext } from '../../shared/decorators/get-At-current-user.decorator';
import { JwtATPayload, JwtRTPayload } from '../auth/interfaces/jwtPayload.type';
import { JwtRefreshAuthGuard } from '../auth/guards/jwt-refresh-auth.guard';
import { GetCurrentRTJwtContext } from '../../shared/decorators/get-Rt-current-user.decorator';
import { postToOutputModel } from './models/postsToViewModel';
import { BlogsService } from '../blogs/blogs.service';

@Controller('posts')
export class PostsController {
  constructor(
    protected postsService: PostsService,
    protected commentsService: CommentsService,
    protected postsQueryRepository: PostsQueryRepository,
    protected commentsQueryRepository: CommentsQueryRepository,
  ) {}

  // Post's CRUD

  @Post()
  @UseGuards(BasicAuthGuard)
  async createPost(@Body() createPostDto: CreatePostDto) {
    const newPost = await this.postsService.createPost(createPostDto);

    return postToOutputModel(newPost, '');
  }

  @Get()
  @UseGuards(JwtRefreshAuthGuard)
  getAllPosts(
    @Query() query: postsQueryModel,
    @GetCurrentRTJwtContext() jwtRTPayload: JwtRTPayload,
  ) {
    return this.postsQueryRepository.getAllPosts(
      query,
      jwtRTPayload.user.userId,
    );
  }

  @Get(':postId')
  @UseGuards(JwtRefreshAuthGuard)
  async getPostById(
    @Param('postId') postId: string,
    @GetCurrentRTJwtContext() jwtRTPayload: JwtRTPayload,
  ) {
    const post = await this.postsService.getPostById(postId);

    if (!post) {
      throw new NotFoundException();
    }
    return postToOutputModel(post, jwtRTPayload.user.userId);
  }

  @Put(':postId')
  @UseGuards(BasicAuthGuard)
  @HttpCode(204)
  async updatePost(
    @Param('postId') postId: string,
    @Body() updatePostDto: UpdatePostDto,
  ) {
    const post = await this.postsService.getPostById(postId);

    if (!post) {
      throw new NotFoundException();
    }
    return this.postsService.updatePost(post, updatePostDto);
  }

  @Delete(':postId')
  @UseGuards(BasicAuthGuard)
  @HttpCode(204)
  async deletePost(@Param('postId') postId: string) {
    const post = await this.postsService.getPostById(postId);
    if (!post) {
      throw new NotFoundException('no such post');
    }
    return this.postsService.deletePost(postId);
  }

  // Post's comments

  @Get(':postId/comments')
  @UseGuards(JwtRefreshAuthGuard)
  async getPostComments(
    @Param('postId') postId: string,
    @Query() query: commentsQueryModel,
    @GetCurrentRTJwtContext() jwtRTPayload: JwtRTPayload,
  ) {
    const post = await this.postsService.getPostById(postId);

    if (!post) {
      throw new NotFoundException('no such post');
    }

    return this.commentsQueryRepository.getAllPostComments(
      postId,
      query,
      jwtRTPayload.user.userId,
    );
  }

  @Post(':postId/comments')
  @UseGuards(JwtAuthGuard)
  async createPostComment(
    @Param('postId') postId: string,
    @Body() createCommentDto: CreateCommentDto,
    @GetCurrentATJwtContext() jwtATPayload: JwtATPayload,
  ) {
    const post = await this.postsService.getPostById(postId);

    if (!post) {
      throw new NotFoundException('no such post');
    }

    const newComment = await this.commentsService.createPostComment(
      createCommentDto,
      postId,
      jwtATPayload.user.userId,
      jwtATPayload.user.login,
    );

    return commentToOutputModel(newComment, jwtATPayload.user.userId);
  }

  // Post's likes

  @Put(':postId/like-status')
  @UseGuards(JwtAuthGuard)
  @HttpCode(204)
  async setPostLikeStatus(
    @Param('postId') postId: string,
    @Body() setLikeStatusDto: SetLikeStatusDto,
    @GetCurrentATJwtContext() jwtATPayload: JwtATPayload,
  ) {
    const post = await this.postsService.getPostById(postId);

    if (!post) {
      throw new NotFoundException('no such post');
    }

    return this.postsService.setPostLikeStatus(
      postId,
      jwtATPayload.user.userId,
      jwtATPayload.user.login,
      setLikeStatusDto,
    );
  }
}
