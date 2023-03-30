import { Module } from '@nestjs/common';
import { UsersService } from './services/users.service';
import { PasswordService } from '../../application/password.service';
import { BasicStrategy } from '../auth/strategies/basic.strategy';
import { UsersSaController } from './controllers/users.sa.controller';
import { CqrsModule } from '@nestjs/cqrs';
import { BanUserHandler } from './use-cases/banUser.useCase';
import { SecurityService } from '../security/services/security.service';
import { JwtService } from '@nestjs/jwt';
import { CreateUserHandler } from './use-cases/createUser.useCase';
import { BanUserForBlogHandler } from './use-cases/banUserForBlog.useCase';
import { UsersBloggerController } from './controllers/users.blogger.controller';
import { BlogsService } from '../blogs/blogs.service';
import { UsersMongoRepository } from './infrastructure/mongo/users.mongo.repository';
import { MongooseModule } from '@nestjs/mongoose';
import { IUsersRepository } from './core/abstracts/users.repository.abstract';
import { DataBaseModule } from '../../db/db.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersPostgreSqlRepository } from './infrastructure/postgreSql/users.postgresql.repository';
import { DeleteUserHandler } from './use-cases/deleteUser.useCase';
import { RecoveryUserPasswordHandler } from '../auth/use-cases/recoveryUserPassword.useCase';
import { ConfirmUserEmailHandler } from '../auth/use-cases/confirmUserEmail.useCase';
import { UpdateUserPasswordDataHandler } from '../auth/use-cases/updateUserPasswordData.useCase';
import { AddUserInvalidRefreshTokenHandler } from './use-cases/addUserInvalidRefreshToken.useCase';
import {
  BlogsBanInfo,
  EmailConfirmation,
  InvalidRefreshTokens,
  PasswordRecovery,
  User,
  UserBanInfo,
} from './infrastructure/postgreSql/model/user.entity';
import { IUsersQueryRepository } from './core/abstracts/usersQuery.repository.abstract';
import { UsersPostgreSqlQueryRepository } from './infrastructure/postgreSql/usersPostgreSqlQuery.repository';
import { Security } from '../security/infrastructure/postgreSql/model/security.entity';
import { SecurityModule } from '../security/security.module';

const handlers = [
  BanUserHandler,
  CreateUserHandler,
  BanUserForBlogHandler,
  DeleteUserHandler,
  AddUserInvalidRefreshTokenHandler,
];
@Module({
  imports: [
    DataBaseModule,
    // MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    TypeOrmModule.forFeature([
      User,
      EmailConfirmation,
      PasswordRecovery,
      BlogsBanInfo,
      InvalidRefreshTokens,
      UserBanInfo,
      Security,
    ]),
    SecurityModule,
    CqrsModule,
  ],
  controllers: [UsersSaController, UsersBloggerController],
  providers: [
    UsersService,
    PasswordService,
    // UsersQueryRepository,
    BasicStrategy,
    SecurityService,
    JwtService,
    BlogsService,
    {
      provide: IUsersRepository,
      useClass: UsersPostgreSqlRepository,
    },
    {
      provide: IUsersQueryRepository,
      useClass: UsersPostgreSqlQueryRepository,
    },
    ...handlers,
  ],
  exports: [
    ...handlers,
    UsersService,
    {
      provide: IUsersRepository,
      useClass: UsersPostgreSqlRepository,
    },
  ],
})
export class UsersModule {}
