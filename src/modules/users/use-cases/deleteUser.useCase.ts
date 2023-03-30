import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { IUsersRepository } from '../core/abstracts/users.repository.abstract';

export class DeleteUserCommand {
  constructor(public readonly userId: string) {}
}

@CommandHandler(DeleteUserCommand)
export class DeleteUserHandler implements ICommandHandler<DeleteUserCommand> {
  constructor(public readonly usersRepository: IUsersRepository) {}
  async execute(command: DeleteUserCommand): Promise<any> {
    const { userId } = command;

    await this.usersRepository.deleteUser(userId);
  }
}
