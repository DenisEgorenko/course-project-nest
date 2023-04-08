import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { v4 as uuidv4 } from 'uuid';
import { add } from 'date-fns';
import { PasswordService } from '../../../application/password.service';

import { RegisterUserDto } from '../dto/registerUser.dto';
import { EmailManager } from '../../../email-service/email-manager';
import { UserBaseEntity } from '../../users/core/entity/user.entity';
import { IUsersRepository } from '../../users/core/abstracts/users.repository.abstract';

export class RegistrationCommand {
  constructor(public readonly registerUserDto: RegisterUserDto) {}
}

@CommandHandler(RegistrationCommand)
export class RegistrationHandler
  implements ICommandHandler<RegistrationCommand>
{
  constructor(
    protected passwordService: PasswordService,
    public readonly usersRepository: IUsersRepository,
  ) {}
  async execute(command: RegistrationCommand): Promise<any> {
    const { registerUserDto } = command;

    const passwordSalt = await this.passwordService.generateSalt();
    const passwordHash = await this.passwordService.generateHash(
      registerUserDto.password,
      passwordSalt,
    );

    const emailConfirmationCode = uuidv4();
    const emailConfirmationExpirationDate = add(new Date(), {
      hours: 1,
    });

    const newUser = new UserBaseEntity();

    newUser.login = registerUserDto.login;
    newUser.email = registerUserDto.email;
    newUser.password = passwordHash;
    newUser.salt = passwordSalt;
    newUser.createdAt = new Date();
    newUser.emailConfirmation.confirmationCode = emailConfirmationCode;
    newUser.emailConfirmation.expirationDate = emailConfirmationExpirationDate;
    newUser.emailConfirmation.isConfirmed = false;

    const createdUser = await this.usersRepository.save(newUser);

    EmailManager.sendRegistrationEmail(newUser);

    return createdUser;
  }
}
