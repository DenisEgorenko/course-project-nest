import { Module } from '@nestjs/common';
import { DataBaseModule } from '../../db/db.module';
import { SecurityController } from './controllers/security.controller';
import { SecurityService } from './services/security.service';
import { JwtService } from '@nestjs/jwt';
import { PasswordService } from '../../application/password.service';
import { UsersModule } from '../users/users.module';
import { CqrsModule } from '@nestjs/cqrs';

import { SecurityPostgreSqlRepository } from './infrastructure/postgreSql/security.postgreSql.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Security } from './infrastructure/postgreSql/model/security.entity';
import { ISecurityRepository } from './core/abstracts/security.repository.abstract';

const handlers = [];
@Module({
  imports: [DataBaseModule, CqrsModule, TypeOrmModule.forFeature([Security])],
  controllers: [SecurityController],
  providers: [
    JwtService,
    PasswordService,
    {
      provide: ISecurityRepository,
      useClass: SecurityPostgreSqlRepository,
    },
    SecurityService,
    ...handlers,
  ],
  exports: [
    {
      provide: ISecurityRepository,
      useClass: SecurityPostgreSqlRepository,
    },
    SecurityService,
  ],
})
export class SecurityModule {}
