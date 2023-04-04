import {
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  HttpCode,
  NotFoundException,
  Param,
  Put,
  UseGuards,
} from '@nestjs/common';
import { CommentsService } from './comments.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { GetCurrentATJwtContext } from '../../shared/decorators/get-At-current-user.decorator';
import { JwtATPayload, JwtRTPayload } from '../auth/interfaces/jwtPayload.type';
import { AuthGuardForLikes } from '../auth/guards/auth-guard-for-likes.guard';
import { GetCurrentRTJwtContext } from '../../shared/decorators/get-Rt-current-user.decorator';
import { UpdateCommentDto } from './dto/updateComment.dto';
import { SetLikeStatusDto } from '../posts/dto/setLikeStatusDto';
import { UsersService } from '../users/services/users.service';
import { CommandBus } from '@nestjs/cqrs';
import { SetCommentLikeStatusCommand } from './use-cases/setCommentLikeStatus.useCase';
import { commentToOutputModel } from './models/commentsToOutputModel';
import { UpdateCommentCommand } from './use-cases/updateComment.useCase';

@Controller('comments')
export class CommentsController {
  constructor(
    protected commentsService: CommentsService,
    protected usersService: UsersService,
    protected commandBus: CommandBus,
  ) {}

  @Get(':commentId')
  @UseGuards(AuthGuardForLikes)
  async getCommentById(
    @Param('commentId') commentId: string,
    @GetCurrentRTJwtContext() jwtRTPayload: JwtRTPayload,
  ) {
    const comment = await this.commentsService.getCommentById(commentId);

    if (!comment) {
      throw new NotFoundException('no such comment');
    }

    if (comment.user.userBanInfo.banStatus) {
      throw new NotFoundException();
    }

    return commentToOutputModel(comment, jwtRTPayload.user.userId);
  }

  @Put(':commentId')
  @UseGuards(JwtAuthGuard)
  @HttpCode(204)
  async updateCommentById(
    @Param('commentId') commentId: string,
    @Body() updateCommentDto: UpdateCommentDto,
    @GetCurrentATJwtContext() jwtATPayload: JwtATPayload,
  ) {
    const comment = await this.commentsService.getCommentById(commentId);
    if (!comment) {
      throw new NotFoundException();
    }

    if (comment.user.id !== jwtATPayload.user.userId) {
      throw new ForbiddenException();
    }

    await this.commandBus.execute(
      new UpdateCommentCommand(updateCommentDto, commentId),
    );
  }

  @Put(':commentId/like-status')
  @UseGuards(JwtAuthGuard)
  @HttpCode(204)
  async updateCommentLikeStatus(
    @Param('commentId') commentId: string,
    @GetCurrentATJwtContext() jwtATPayload: JwtATPayload,
    @Body() setLikeStatusDto: SetLikeStatusDto,
  ) {
    const comment = await this.commentsService.getCommentById(commentId);

    if (!comment) {
      throw new NotFoundException();
    }

    await this.commandBus.execute(
      new SetCommentLikeStatusCommand(
        setLikeStatusDto,
        commentId,
        jwtATPayload.user.userId,
      ),
    );
  }

  @Delete(':commentId')
  @UseGuards(JwtAuthGuard)
  @HttpCode(204)
  async deleteCommentById(
    @Param('commentId') commentId: string,
    @GetCurrentATJwtContext() jwtATPayload: JwtATPayload,
  ) {
    const comment = await this.commentsService.getCommentById(commentId);

    if (!comment) {
      throw new NotFoundException();
    }

    if (comment.user.id !== jwtATPayload.user.userId) {
      throw new ForbiddenException();
    }
    return this.commentsService.deleteCommentById(commentId);
  }
}
