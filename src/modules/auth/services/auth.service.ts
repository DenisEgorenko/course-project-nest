import { Injectable } from '@nestjs/common';
import { UsersService } from '../../users/services/users.service';
import { JwtService } from '@nestjs/jwt';
import { PasswordService } from '../../../application/password.service';
import { UserDocument } from '../../users/infrastructure/mongo/model/user.schema';
import { SecurityService } from '../../security/services/security.service';
import { JwtATPayload, JwtRTPayload } from '../interfaces/jwtPayload.type';
import { v4 as uuidv4 } from 'uuid';
import { UserBaseEntity } from '../../users/core/entity/user.entity';
import { CommandBus } from '@nestjs/cqrs';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly securityService: SecurityService,
  ) {}

  async isTokenInvalid(userId: string, refreshToken: string): Promise<boolean> {
    const user = await this.usersService.findUserByUserId(userId);
    return !!user.invalidRefreshTokens.find(
      (token) => token.invalidRefreshToken === refreshToken,
    );
  }

  // async generateNewTokens(
  //   userId: string,
  //   login: string,
  //   email: string,
  //   deviceId: string,
  // ) {
  //   const AtPayload: JwtATPayload = {
  //     user: {
  //       userId,
  //       login,
  //       email,
  //     },
  //   };
  //   const RtPayload: JwtRTPayload = {
  //     user: { userId, login, email },
  //     deviceId,
  //   };
  //   //
  //   // const accessToken = await this.createAccessToken(AtPayload);
  //   //
  //   // const refreshToken = await this.createRefreshToken(RtPayload);
  //
  //   const accessToken = 'hh';
  //
  //   const refreshToken = 'hh';
  //
  //   await this.securityService.updateSecuritySessionLastActiveDate(deviceId);
  //   // await this.usersService.addInvalidRefreshToken(userId, refreshToken);
  //
  //   return {
  //     access_token: accessToken,
  //     refresh_token: refreshToken,
  //   };
  // }
}
