import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { IUsersRepository } from '../../users/core/abstracts/users.repository.abstract';

export class ClearAllDataCommand {}

@CommandHandler(ClearAllDataCommand)
export class ClearAllDataHandler
  implements ICommandHandler<ClearAllDataCommand>
{
  constructor(public readonly usersRepository: IUsersRepository) {}
  async execute(command: ClearAllDataCommand): Promise<any> {
    await this.usersRepository.clearAllData();
  }
}
