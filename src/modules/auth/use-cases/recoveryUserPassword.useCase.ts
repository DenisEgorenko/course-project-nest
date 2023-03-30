import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { IUsersRepository } from '../../users/core/abstracts/users.repository.abstract';
import { EmailManager } from '../../../email-service/email-manager';
import { v4 as uuidv4 } from 'uuid';
import { PasswordRecoveryDto } from '../dto/passwordRecovery.dto';
import { add } from 'date-fns';

export class RecoveryUserPasswordCommand {
  constructor(public readonly passwordRecoveryDto: PasswordRecoveryDto) {}
}

@CommandHandler(RecoveryUserPasswordCommand)
export class RecoveryUserPasswordHandler
  implements ICommandHandler<RecoveryUserPasswordCommand>
{
  constructor(public readonly usersRepository: IUsersRepository) {}
  async execute(command: RecoveryUserPasswordCommand): Promise<any> {
    const { passwordRecoveryDto } = command;

    const recoveryCode = uuidv4();
    const expirationDate = add(new Date(), {
      hours: 1,
    });

    const user = await this.usersRepository.findUserByLoginOrEmail(
      passwordRecoveryDto.email,
    );

    console.log(user);

    user.setRecoveryCode(recoveryCode);
    user.setExpirationDate(expirationDate);

    await this.usersRepository.save(user);

    await EmailManager.sendPasswordRecoveryEmail(
      passwordRecoveryDto.email,
      recoveryCode,
    );
  }
}
