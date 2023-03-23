import { Module } from '@nestjs/common';
import { DataBaseModule } from '../../db/db.module';
import { CommentsController } from './comments.controller';
import { CommentsService } from './comments.service';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { PasswordService } from '../../application/password.service';

@Module({
  imports: [DataBaseModule],
  controllers: [CommentsController],
  providers: [CommentsService, JwtService, UsersService, PasswordService],
})
export class CommentsModule {}
