import { Controller, Get, Param } from '@nestjs/common';
import { CommentsService } from './comments.service';

@Controller('comments')
export class CommentsController {
  constructor(protected commentsService: CommentsService) {}

  @Get(':id')
  async getCommentById(@Param('id') id: string) {
    return await this.commentsService.getCommentById(id, '');
  }
}
