import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { v4 as uuidv4 } from 'uuid';
import { IUsersRepository } from '../../users/core/abstracts/users.repository.abstract';
import { JwtATPayload, JwtRTPayload } from '../interfaces/jwtPayload.type';
import { JwtTokenManager } from '../jwt-manager/jwt-token.manager';
import { Security } from '../../security/infrastructure/postgreSql/model/security.entity';
import { ISecurityRepository } from '../../security/core/abstracts/security.repository.abstract';
import { InvalidRefreshTokens } from '../../users/infrastructure/postgreSql/model/user.entity';

export class RefreshTokenCommand {
  constructor(
    public readonly userId: string,
    public readonly deviceId: string,
    public readonly oldRefreshToken: string,
  ) {}
}

@CommandHandler(RefreshTokenCommand)
export class RefreshTokenHandler
  implements ICommandHandler<RefreshTokenCommand>
{
  constructor(
    public readonly usersRepository: IUsersRepository,
    public readonly securityRepository: ISecurityRepository,
    public readonly jwtTokenManager: JwtTokenManager,
  ) {}
  async execute(command: RefreshTokenCommand): Promise<any> {
    const { userId, deviceId, oldRefreshToken } = command;

    const user = await this.usersRepository.findUserByUserId(userId);

    const invalidRefreshToken = new InvalidRefreshTokens();
    invalidRefreshToken.invalidRefreshToken = oldRefreshToken;

    user.invalidRefreshTokens = [
      ...user.invalidRefreshTokens,
      invalidRefreshToken,
    ];

    await this.usersRepository.save(user);

    const securitySession =
      await this.securityRepository.getSecuritySessionById(deviceId);

    securitySession.lastActiveDate = new Date();

    await this.securityRepository.save(securitySession);

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

    return {
      access_token: accessToken,
      refresh_token: refreshToken,
    };
  }
}
