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
import { commentToOutputModel } from './commentsQuery.repository';
import { UpdateCommentDto } from './dto/updateComment.dto';
import { SetLikeStatusDto } from '../posts/dto/setLikeStatusDto';
import { UsersService } from '../users/services/users.service';

@Controller('comments')
export class CommentsController {
  constructor(
    protected commentsService: CommentsService,
    protected usersService: UsersService,
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

    const bannedUsers = await this.usersService.getAllBannedUsersIds();

    if (bannedUsers.includes(comment.userId)) {
      throw new NotFoundException();
    }

    return commentToOutputModel(comment, jwtRTPayload.user.userId, bannedUsers);
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
    if (comment.userId !== jwtATPayload.user.userId) {
      throw new ForbiddenException();
    }

    await this.commentsService.updateComment(
      commentId,
      updateCommentDto.content,
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

    await this.commentsService.setCommentLikeStatus(
      commentId,
      jwtATPayload.user.userId,
      setLikeStatusDto,
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

    if (comment.userId !== jwtATPayload.user.userId) {
      throw new ForbiddenException();
    }
    return this.commentsService.deleteCommentById(commentId);
  }
}
