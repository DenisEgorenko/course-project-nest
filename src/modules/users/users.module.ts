import { Module } from '@nestjs/common';
import { UsersQueryRepository } from './usersQuery.repository';
import { UsersService } from './users.service';
import { DataBaseModule } from '../../db/db.module';
import { PasswordService } from '../../application/password.service';
import { BasicStrategy } from '../auth/strategies/basic.strategy';
import { UsersSaController } from './controllers/users.sa.controller';
import { CqrsModule } from '@nestjs/cqrs';
import { BanUSerHandler } from './use-cases/banUser.useCase';
import { SecurityService } from '../security/security.service';
import { JwtService } from '@nestjs/jwt';
import { CreateUserHandler } from './use-cases/createUser.useCase';
import { BanUserForBlogHandler } from './use-cases/banUserForBlog.useCase';
import { UsersBloggerController } from './controllers/users.blogger.controller';
import { BlogsService } from '../blogs/blogs.service';

const handlers = [BanUSerHandler, CreateUserHandler, BanUserForBlogHandler];
@Module({
  imports: [DataBaseModule, CqrsModule],
  controllers: [UsersSaController, UsersBloggerController],
  providers: [
    UsersService,
    PasswordService,
    UsersQueryRepository,
    BasicStrategy,
    SecurityService,
    JwtService,
    BlogsService,
    ...handlers,
  ],
})
export class UsersModule {}
