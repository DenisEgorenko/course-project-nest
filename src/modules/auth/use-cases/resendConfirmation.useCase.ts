import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { v4 as uuidv4 } from 'uuid';
import { add } from 'date-fns';
import { PasswordService } from '../../../application/password.service';

import { RegisterUserDto } from '../dto/registerUser.dto';
import { EmailManager } from '../../../email-service/email-manager';
import { UserBaseEntity } from '../../users/core/entity/user.entity';
import { IUsersRepository } from '../../users/core/abstracts/users.repository.abstract';
import { ResendConfirmationDto } from '../dto/resendConfirmation.dto';

export class ResendConfirmationCommand {
  constructor(public readonly resendConfirmationDto: ResendConfirmationDto) {}
}

@CommandHandler(ResendConfirmationCommand)
export class ResendConfirmationHandler
  implements ICommandHandler<ResendConfirmationCommand>
{
  constructor(public readonly usersRepository: IUsersRepository) {}
  async execute(command: ResendConfirmationCommand): Promise<any> {
    const { resendConfirmationDto } = command;

    const user = await this.usersRepository.findUserByLoginOrEmail(
      resendConfirmationDto.email,
    );

    const emailConfirmationCode = uuidv4();
    const emailConfirmationExpirationDate = add(new Date(), {
      hours: 1,
    });

    user.setConfirmationCode(emailConfirmationCode);
    user.setConfirmationCodeExpDate(emailConfirmationExpirationDate);

    const updatedUser = await this.usersRepository.save(user);

    EmailManager.sendRegistrationEmail(updatedUser);
  }
}
