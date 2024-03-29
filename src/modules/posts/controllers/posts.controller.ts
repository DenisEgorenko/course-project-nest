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
import { PostsQueryModel } from '../models/postsQueryModel';
import { CommentsQueryModel } from '../../comments/models/commentsQueryModel';
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
    protected commandBus: CommandBus,
    protected blogsService: BlogsService,
  ) {}

  // Post's CRUD

  @Get()
  @UseGuards(AuthGuardForLikes)
  async getAllPosts(
    @Query() postsQueryModel: PostsQueryModel,
    @GetCurrentRTJwtContext() jwtRTPayload: JwtRTPayload,
  ) {
    const items = await this.postsService.getAllPosts(postsQueryModel);

    return postsToOutputModel(
      postsQueryModel,
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
    @Query() commentsQueryModel: CommentsQueryModel,
    @GetCurrentRTJwtContext() jwtRTPayload: JwtRTPayload,
  ) {
    const post = await this.postsService.getPostById(postId);

    if (!post) {
      throw new NotFoundException('no such post');
    }

    const result = await this.commentsService.getAllCommentsForPost(
      commentsQueryModel,
      postId,
    );

    const model = commentsToOutputModel(
      commentsQueryModel,
      result.items,
      result.totalCount,
      jwtRTPayload.user.userId,
    );

    console.log(model);
    return model;
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
