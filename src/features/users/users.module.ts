import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersQueryRepository } from './usersQuery.repository';
import { UsersService } from './users.service';
import { DataBaseModule } from '../../db/db.module';
import { PasswordService } from '../../application/password.service';

@Module({
  imports: [DataBaseModule],
  controllers: [UsersController],
  providers: [UsersService, PasswordService, UsersQueryRepository],
})
export class UsersModule {}
