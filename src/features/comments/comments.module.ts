import { Module } from '@nestjs/common';
import { DataBaseModule } from '../../db/db.module';
import { CommentsController } from './comments.controller';
import { CommentsService } from './comments.service';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [DataBaseModule],
  controllers: [CommentsController],
  providers: [CommentsService, JwtService],
})
export class CommentsModule {}
