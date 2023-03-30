import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { IUsersRepository } from '../../users/core/abstracts/users.repository.abstract';

export class ConfirmUserEmailCommand {
  constructor(public readonly code: string) {}
}

@CommandHandler(ConfirmUserEmailCommand)
export class ConfirmUserEmailHandler
  implements ICommandHandler<ConfirmUserEmailCommand>
{
  constructor(public readonly usersRepository: IUsersRepository) {}
  async execute(command: ConfirmUserEmailCommand): Promise<any> {
    const { code } = command;

    const user = await this.usersRepository.findUserByConfirmationCode(code);

    user.setIsConfirmed(true);

    await this.usersRepository.save(user);
  }
}
