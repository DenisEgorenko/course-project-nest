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
import { CreatePostDto } from '../blogs/controllers/dto/createPost.dto';
import { UpdatePostDto } from '../blogs/controllers/dto/updatePost.dto';
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
import { AuthGuardForLikes } from '../auth/guards/auth-guard-for-likes.guard';
import { GetCurrentRTJwtContext } from '../../shared/decorators/get-Rt-current-user.decorator';
import { postToOutputModel } from './models/postsToViewModel';
import { BlogsService } from '../blogs/blogs.service';
import { UsersService } from '../users/users.service';

@Controller('posts')
export class PostsController {
  constructor(
    protected postsService: PostsService,
    protected commentsService: CommentsService,
    protected usersService: UsersService,
    protected postsQueryRepository: PostsQueryRepository,
    protected commentsQueryRepository: CommentsQueryRepository,
  ) {}

  // Post's CRUD

  @Get()
  @UseGuards(AuthGuardForLikes)
  async getAllPosts(
    @Query() query: postsQueryModel,
    @GetCurrentRTJwtContext() jwtRTPayload: JwtRTPayload,
  ) {
    const bannedUsers = await this.usersService.getAllBannedUsersIds();

    return this.postsQueryRepository.getAllPosts(
      query,
      jwtRTPayload.user.userId,
      bannedUsers,
    );
  }

  @Get(':postId')
  @UseGuards(AuthGuardForLikes)
  async getPostById(
    @Param('postId') postId: string,
    @GetCurrentRTJwtContext() jwtRTPayload: JwtRTPayload,
  ) {
    const post = await this.postsService.getPostById(postId);

    if (!post) {
      throw new NotFoundException();
    }
    return postToOutputModel(post, jwtRTPayload.user.userId, []);
  }

  // Post's comments

  @Get(':postId/comments')
  @UseGuards(AuthGuardForLikes)
  async getPostComments(
    @Param('postId') postId: string,
    @Query() query: commentsQueryModel,
    @GetCurrentRTJwtContext() jwtRTPayload: JwtRTPayload,
  ) {
    const post = await this.postsService.getPostById(postId);

    if (!post) {
      throw new NotFoundException('no such post');
    }

    const bannedUsers = await this.usersService.getAllBannedUsersIds();

    return this.commentsQueryRepository.getAllPostComments(
      postId,
      query,
      jwtRTPayload.user.userId,
      bannedUsers,
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

    return commentToOutputModel(newComment, jwtATPayload.user.userId, []);
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

    console.log(post);

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
