import {
  Body,
  Controller,
  ForbiddenException,
  Get,
  HttpCode,
  NotFoundException,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { PostsService } from '../posts.service';
import { PostsQueryRepository } from '../postsQuery.repository';
import { postsQueryModel } from '../models/postsQueryModel';
import { commentsQueryModel } from '../../comments/models/commentsQueryModel';
import {
  CommentsQueryRepository,
  commentToOutputModel,
} from '../../comments/commentsQuery.repository';
import { CreateCommentDto } from '../../comments/dto/createComment.dto';
import { CommentsService } from '../../comments/comments.service';
import { SetLikeStatusDto } from '../dto/setLikeStatusDto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { GetCurrentATJwtContext } from '../../../shared/decorators/get-At-current-user.decorator';
import {
  JwtATPayload,
  JwtRTPayload,
} from '../../auth/interfaces/jwtPayload.type';
import { AuthGuardForLikes } from '../../auth/guards/auth-guard-for-likes.guard';
import { GetCurrentRTJwtContext } from '../../../shared/decorators/get-Rt-current-user.decorator';
import {
  postsToOutputModel,
  postToOutputModel,
} from '../models/postsToViewModel';
import { BlogsService } from '../../blogs/blogs.service';
import { UsersService } from '../../users/services/users.service';
import { IPostsQueryRepository } from '../core/abstracts/postsQuery.repository.abstract';

@Controller('posts')
export class PostsController {
  constructor(
    protected postsService: PostsService,
    protected commentsService: CommentsService,
    protected usersService: UsersService,
    protected blogsService: BlogsService,

    protected postsQueryRepository: IPostsQueryRepository,
    protected commentsQueryRepository: CommentsQueryRepository,
  ) {}

  // Post's CRUD

  @Get()
  @UseGuards(AuthGuardForLikes)
  async getAllPosts(
    @Query() query: postsQueryModel,
    @GetCurrentRTJwtContext() jwtRTPayload: JwtRTPayload,
  ) {
    const items = await this.postsService.getAllPosts(query);

    return postsToOutputModel(query, items.items, items.totalCount);
  }

  @Get(':postId')
  @UseGuards(AuthGuardForLikes)
  async getPostById(
    @Param('postId') postId: string,
    @GetCurrentRTJwtContext() jwtRTPayload: JwtRTPayload,
  ) {
    console.log('here');
    const post = await this.postsService.getPostById(postId);

    if (!post) {
      throw new NotFoundException();
    }

    console.log(post);

    if (post.blog.isBanned) {
      throw new NotFoundException();
    }

    return postToOutputModel(post);
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

    if (
      await this.usersService.getUserStatusForBlog(
        jwtATPayload.user.userId,
        post.blogId,
      )
    ) {
      throw new ForbiddenException();
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