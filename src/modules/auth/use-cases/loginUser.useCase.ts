import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { v4 as uuidv4 } from 'uuid';
import { IUsersRepository } from '../../users/core/abstracts/users.repository.abstract';
import { JwtATPayload, JwtRTPayload } from '../interfaces/jwtPayload.type';
import { JwtTokenManager } from '../jwt-manager/jwt-token.manager';
import { Security } from '../../security/infrastructure/postgreSql/model/security.entity';
import { ISecurityRepository } from '../../security/core/abstracts/security.repository.abstract';

export class LoginUserCommand {
  constructor(
    public readonly userId: string,
    public readonly ip: string,
    public readonly deviceTitle: string,
  ) {}
}

@CommandHandler(LoginUserCommand)
export class LoginUserHandler implements ICommandHandler<LoginUserCommand> {
  constructor(
    public readonly usersRepository: IUsersRepository,
    public readonly securityRepository: ISecurityRepository,
    public readonly jwtTokenManager: JwtTokenManager,
  ) {}
  async execute(command: LoginUserCommand): Promise<any> {
    const { userId, ip, deviceTitle } = command;

    const user = await this.usersRepository.findUserByUserId(userId);

    const deviceId = uuidv4();

    const AtPayload: JwtATPayload = {
      user: {
        userId: user.id,
        login: user.login,
        email: user.email,
      },
    };

    const RtPayload: JwtRTPayload = {
      user: {
        userId: user.id,
        login: user.login,
        email: user.email,
      },
      deviceId,
    };

    const accessToken = await this.jwtTokenManager.createAccessToken(AtPayload);

    const refreshToken = await this.jwtTokenManager.createRefreshToken(
      RtPayload,
    );

    const newSession = new Security();

    newSession.ip = ip;
    newSession.title = deviceTitle;
    newSession.lastActiveDate = new Date();
    newSession.deviceId = deviceId;
    newSession.userId = userId;

    newSession.user = user;

    await this.securityRepository.save(newSession);

    return {
      access_token: accessToken,
      refresh_token: refreshToken,
    };
  }
}
