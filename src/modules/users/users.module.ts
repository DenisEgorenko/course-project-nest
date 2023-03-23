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

const handlers = [BanUSerHandler];
@Module({
  imports: [DataBaseModule, CqrsModule],
  controllers: [UsersSaController],
  providers: [
    UsersService,
    PasswordService,
    UsersQueryRepository,
    BasicStrategy,
    SecurityService,
    JwtService,
    ...handlers,
  ],
})
export class UsersModule {}
