import { Module } from '@nestjs/common';
import { DataBaseModule } from '../../db/db.module';
import { CommentsController } from './comments.controller';
import { CommentsService } from './comments.service';
import { JwtService } from '@nestjs/jwt';
import { PasswordService } from '../../application/password.service';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [DataBaseModule, UsersModule],
  controllers: [CommentsController],
  providers: [CommentsService, JwtService, PasswordService],
})
export class CommentsModule {}
