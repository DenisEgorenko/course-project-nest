import { Module } from '@nestjs/common';
import { DataBaseModule } from '../../db/db.module';
import { TestingController } from './testing.controller';
import { CqrsModule } from '@nestjs/cqrs';
import { ClearAllDataHandler } from './use-cases/clearAllData.useCase';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [DataBaseModule, CqrsModule, UsersModule],
  controllers: [TestingController],
  providers: [ClearAllDataHandler],
})
export class TestingModule {}
