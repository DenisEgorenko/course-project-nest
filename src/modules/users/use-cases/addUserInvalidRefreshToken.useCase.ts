import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { IUsersRepository } from '../core/abstracts/users.repository.abstract';

export class AddUserInvalidRefreshTokenCommand {
  constructor(
    public readonly userId: string,
    public readonly refreshToken: string | null,
  ) {}
}

@CommandHandler(AddUserInvalidRefreshTokenCommand)
export class AddUserInvalidRefreshTokenHandler
  implements ICommandHandler<AddUserInvalidRefreshTokenCommand>
{
  constructor(public readonly usersRepository: IUsersRepository) {}
  async execute(command: AddUserInvalidRefreshTokenCommand): Promise<any> {
    const { userId, refreshToken } = command;
    const user = await this.usersRepository.findUserByUserId(userId);

    // user.addInvalidRefreshToken(refreshToken);

    await this.usersRepository.save(user);
  }
}
