import { Controller, Delete, HttpCode, Param, Res } from '@nestjs/common';
import { TestingService } from './testing.service';

@Controller('testing')
export class TestingController {
  constructor(protected testingService: TestingService) {}

  @Delete('all-data')
  @HttpCode(204)
  async delete() {
    return this.testingService.deleteAllData();
  }
}
