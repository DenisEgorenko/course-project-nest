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
import { postsQueryModel } from '../models/postsQueryModel';
import { commentsQueryModel } from '../../comments/models/commentsQueryModel';
import { CommentsQueryRepository } from '../../comments/commentsQuery.repository';
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
import { UsersService } from '../../users/services/users.service';
import { CommandBus } from '@nestjs/cqrs';
import { SetPostLikeStatusCommand } from '../use-cases/setPostLikeStatus.useCase';
import { CreateCommentCommand } from '../../comments/use-cases/createComment.useCase';
import { BlogsService } from '../../blogs/blogs.service';
import {
  commentsToOutputModel,
  commentToOutputModel,
} from '../../comments/models/commentsToOutputModel';

@Controller('posts')
export class PostsController {
  constructor(
    protected postsService: PostsService,
    protected commentsService: CommentsService,
    protected usersService: UsersService,
    protected commandBus: CommandBus,
    protected commentsQueryRepository: CommentsQueryRepository,

    protected blogsService: BlogsService,
  ) {}

  // Post's CRUD

  @Get()
  @UseGuards(AuthGuardForLikes)
  async getAllPosts(
    @Query() query: postsQueryModel,
    @GetCurrentRTJwtContext() jwtRTPayload: JwtRTPayload,
  ) {
    const items = await this.postsService.getAllPosts(query);

    return postsToOutputModel(
      query,
      items.items,
      items.totalCount,
      jwtRTPayload.user.userId,
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

    if (post.blog.isBanned) {
      throw new NotFoundException();
    }

    return postToOutputModel(post, jwtRTPayload.user.userId);
  }

  // Post's comments

  @Get(':postId/comments')
  @UseGuards(AuthGuardForLikes)
  async getPostComments(
    @Param('postId') postId: string,
    @Query() query: commentsQueryModel,
    @GetCurrentRTJwtContext() jwtRTPayload: JwtRTPayload,
  ) {
    console.log('in case if mistake is in get request');

    const post = await this.postsService.getPostById(postId);

    if (!post) {
      throw new NotFoundException('no such post');
    }

    const result = await this.commentsService.getAllCommentsForPost(
      query,
      postId,
    );

    return commentsToOutputModel(
      query,
      result.items,
      result.totalCount,
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
    console.log('Mistake is here');

    console.log(createCommentDto);

    console.log('But there also should be DTO');

    const post = await this.postsService.getPostById(postId);

    if (!post) {
      throw new NotFoundException('no such post');
    }

    const blog = await this.blogsService.getBlogById(post.blog.id);

    const ban = blog.blogsBanInfo.filter(
      (ban) => ban.user.id === jwtATPayload.user.userId,
    );

    if (ban.length && ban[0].isBanned) {
      throw new ForbiddenException();
    }

    const newComment = await this.commandBus.execute(
      new CreateCommentCommand(
        createCommentDto,
        postId,
        jwtATPayload.user.userId,
      ),
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

    return await this.commandBus.execute(
      new SetPostLikeStatusCommand(
        setLikeStatusDto,
        postId,
        jwtATPayload.user.userId,
      ),
    );
  }
}
