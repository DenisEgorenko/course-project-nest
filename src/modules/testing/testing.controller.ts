import { Controller, Delete, HttpCode, Param, Res } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { ClearAllDataCommand } from './use-cases/clearAllData.useCase';

@Controller('testing')
export class TestingController {
  constructor(protected commandBus: CommandBus) {}

  @Delete('all-data')
  @HttpCode(204)
  async delete() {
    console.log('testing');
    return await this.commandBus.execute(new ClearAllDataCommand());
  }
}
