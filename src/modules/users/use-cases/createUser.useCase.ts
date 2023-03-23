import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument, UserModel } from '../../../db/schemas/user.schema';
import { BanStatusDto } from '../dto/banStatus.dto';
import { SecurityService } from '../../security/security.service';
import { CreateUserDto } from '../dto/createUser.dto';
import { v4 as uuidv4 } from 'uuid';
import { add } from 'date-fns';
import { PasswordService } from '../../../application/password.service';

export class CreateUserCommand {
  constructor(public readonly createUserDto: CreateUserDto) {}
}

@CommandHandler(CreateUserCommand)
export class CreateUserHandler implements ICommandHandler<CreateUserCommand> {
  constructor(
    @InjectModel(User.name)
    protected userModel: UserModel,
    protected passwordService: PasswordService,
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

    const newUser = await this.userModel.createUser(
      createUserDto.login,
      createUserDto.email,
      passwordHash,
      passwordSalt,
      emailConfirmationCode,
      emailConfirmationExpirationDate,
      this.userModel,
    );

    const createdUser = await newUser.save();

    return createdUser;
  }
}
