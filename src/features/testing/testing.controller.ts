import { Controller, Delete, Param } from '@nestjs/common';
import { TestingService } from './testing.service';

@Controller('testing')
export class TestingController {
  constructor(protected testingService: TestingService) {}

  @Delete('all-data')
  async delete() {
    return this.testingService.deleteAllData();
  }
}
