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
import { JwtRefreshAuthGuard } from '../auth/guards/jwt-refresh-auth.guard';
import { GetCurrentRTJwtContext } from '../../shared/decorators/get-Rt-current-user.decorator';
import { commentToOutputModel } from './commentsQuery.repository';
import { UpdateCommentDto } from './dto/updateComment.dto';
import { SetLikeStatusDto } from '../posts/dto/setLikeStatusDto';

@Controller('comments')
export class CommentsController {
  constructor(protected commentsService: CommentsService) {}

  @Get(':commentId')
  @UseGuards(JwtRefreshAuthGuard)
  async getCommentById(
    @Param('commentId') commentId: string,
    @GetCurrentRTJwtContext() jwtRTPayload: JwtRTPayload,
  ) {
    const comment = await this.commentsService.getCommentById(commentId);
    if (!comment) {
      throw new NotFoundException('no such comment');
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
    console.log(comment);
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
