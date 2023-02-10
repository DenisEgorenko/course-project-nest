import { Module } from '@nestjs/common';
import { DataBaseModule } from '../../db/db.module';
import { CommentsController } from './comments.controller';
import { CommentsService } from './comments.service';

@Module({
  imports: [DataBaseModule],
  controllers: [CommentsController],
  providers: [CommentsService],
})
export class CommentsModule {}
