import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateUserDto } from '../core/dto/createUser.dto';
import { v4 as uuidv4 } from 'uuid';
import { add } from 'date-fns';
import { PasswordService } from '../../../application/password.service';
import { IUsersRepository } from '../core/abstracts/users.repository.abstract';
import { UserBaseEntity } from '../core/entity/user.entity';
import { InvalidRefreshTokens } from '../infrastructure/postgreSql/model/user.entity';

export class CreateUserCommand {
  constructor(public readonly createUserDto: CreateUserDto) {}
}

@CommandHandler(CreateUserCommand)
export class CreateUserHandler implements ICommandHandler<CreateUserCommand> {
  constructor(
    protected passwordService: PasswordService,
    public readonly usersRepository: IUsersRepository,
  ) {}
  async execute(command: CreateUserCommand): Promise<any> {
    const { createUserDto } = command;

    const passwordSalt = await this.passwordService.generateSalt();
    const passwordHash = await this.passwordService.generateHash(
      createUserDto.password,
      passwordSalt,
    );

    const emailConfirmationCode = uuidv4();
    const emailConfirmationExpirationDate = add(new Date(), {
      hours: 1,
    });

    const newUser = new UserBaseEntity();

    newUser.login = createUserDto.login;
    newUser.email = createUserDto.email;
    newUser.password = passwordHash;
    newUser.salt = passwordSalt;
    newUser.createdAt = new Date();
    newUser.emailConfirmation.confirmationCode = emailConfirmationCode;
    newUser.emailConfirmation.expirationDate = emailConfirmationExpirationDate;
    newUser.emailConfirmation.isConfirmed = true;

    const createdUser = await this.usersRepository.save(newUser);
    return createdUser;
  }
}
