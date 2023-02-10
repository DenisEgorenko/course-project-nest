import { Module } from '@nestjs/common';
import { DataBaseModule } from '../../db/db.module';
import { TestingController } from './testing.controller';
import { TestingService } from './testing.service';

@Module({
  imports: [DataBaseModule],
  controllers: [TestingController],
  providers: [TestingService],
})
export class TestingModule {}
