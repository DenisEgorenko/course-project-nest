import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { v4 as uuidv4 } from 'uuid';
import { add } from 'date-fns';
import { PasswordService } from '../../../application/password.service';

import { RegisterUserDto } from '../dto/registerUser.dto';
import { EmailManager } from '../../../email-service/email-manager';
import { UserBaseEntity } from '../../users/core/entity/user.entity';
import { IUsersRepository } from '../../users/core/abstracts/users.repository.abstract';
import { JwtATPayload, JwtRTPayload } from '../interfaces/jwtPayload.type';
import { JwtService } from '@nestjs/jwt';
import { JwtTokenManager } from '../jwt-manager/jwt-token.manager';
import { Security } from '../../security/infrastructure/postgreSql/model/security.entity';
import { ISecurityRepository } from '../../security/core/abstracts/security.repository.abstract';
import { InvalidRefreshTokens } from '../../users/infrastructure/postgreSql/model/user.entity';

export class LogoutUserCommand {
  constructor(
    public readonly userId: string,
    public readonly deviceId: string,
    public readonly refreshToken: string,
  ) {}
}

@CommandHandler(LogoutUserCommand)
export class LogoutUserHandler implements ICommandHandler<LogoutUserCommand> {
  constructor(
    public readonly usersRepository: IUsersRepository,
    public readonly securityRepository: ISecurityRepository,
  ) {}
  async execute(command: LogoutUserCommand): Promise<any> {
    const { userId, deviceId, refreshToken } = command;

    const user = await this.usersRepository.findUserByUserId(userId);

    const invalidRefreshToken = new InvalidRefreshTokens();
    invalidRefreshToken.invalidRefreshToken = refreshToken;

    user.invalidRefreshTokens = [
      ...user.invalidRefreshTokens,
      invalidRefreshToken,
    ];

    await this.usersRepository.save(user);

    await this.securityRepository.deleteSecuritySession(deviceId);
  }
}
