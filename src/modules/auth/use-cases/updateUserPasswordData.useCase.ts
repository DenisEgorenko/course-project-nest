import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { IUsersRepository } from '../../users/core/abstracts/users.repository.abstract';
import { PasswordService } from '../../../application/password.service';
import { SetNewPasswordDto } from '../dto/setNewPassword.dto';

export class UpdateUserPasswordDataCommand {
  constructor(public readonly setNewPasswordDto: SetNewPasswordDto) {}
}

@CommandHandler(UpdateUserPasswordDataCommand)
export class UpdateUserPasswordDataHandler
  implements ICommandHandler<UpdateUserPasswordDataCommand>
{
  constructor(
    public readonly usersRepository: IUsersRepository,
    public readonly passwordService: PasswordService,
  ) {}
  async execute(command: UpdateUserPasswordDataCommand): Promise<any> {
    const { setNewPasswordDto } = command;

    const user = await this.usersRepository.findUserByRecoveryCode(
      setNewPasswordDto.recoveryCode,
    );
    const passwordSalt = await this.passwordService.generateSalt();
    const passwordHash = await this.passwordService.generateHash(
      setNewPasswordDto.newPassword,
      passwordSalt,
    );

    user.setUserPassword(passwordHash);
    user.setPasswordSalt(passwordSalt);
    user.setRecoveryCode(null);
    user.setExpirationDate(null);

    await this.usersRepository.save(user);
  }
}
