import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { PasswordService } from '../../application/password.service';
import { UserDocument } from '../../db/schemas/user.schema';
import { SecurityService } from '../security/security.service';
import { JwtATPayload, JwtRTPayload } from './interfaces/jwtPayload.type';
import { v4 as uuidv4 } from 'uuid';
import * as datefns from 'date-fns';
import { EmailManager } from '../../email-service/email-manager';
import { RegisterUserDto } from './dto/registerUser.dto';
import { add } from 'date-fns';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly securityService: SecurityService,
    private readonly passwordService: PasswordService,
  ) {}

  async validateUser(
    loginOrEmail: string,
    password: string,
  ): Promise<UserDocument> {
    const user = await this.usersService.findUserByLoginOrEmail(loginOrEmail);

    if (!user) {
      return null;
    }

    const passwordSalt = user.accountData.salt;
    const passwordHash = await this.passwordService.generateHash(
      password,
      passwordSalt,
    );

    if (user && user.accountData.password === passwordHash) {
      return user;
    }
    return null;
  }

  async createRefreshToken(payload: JwtRTPayload) {
    return this.jwtService.sign(payload, { expiresIn: '600s' });
  }

  async createAccessToken(payload: JwtATPayload) {
    return this.jwtService.sign(payload, { expiresIn: '600s' });
  }

  async login(user: UserDocument, ip: string, deviceTitle: string) {
    const AtPayload: JwtATPayload = {
      user: {
        userId: user.accountData.id,
        login: user.accountData.login,
        email: user.accountData.email,
      },
    };

    const deviceId = uuidv4();

    const RtPayload: JwtRTPayload = {
      user: {
        userId: user.accountData.id,
        login: user.accountData.login,
        email: user.accountData.email,
      },
      deviceId,
    };

    const accessToken = await this.createAccessToken(AtPayload);

    const refreshToken = await this.createRefreshToken(RtPayload);

    await this.securityService.createSecuritySession(
      user.accountData.id,
      ip,
      deviceTitle,
      deviceId,
    );

    // await this.usersService.updateRefreshToken(
    //   user.accountData.id,
    //   refreshToken,
    // );

    return {
      access_token: accessToken,
      refresh_token: refreshToken,
    };
  }

  async logout(deviceId: string, userId: string, refreshToken: string) {
    await this.securityService.removeSecuritySession(deviceId);

    await this.usersService.addInvalidRefreshToken(userId, refreshToken);
  }

  async isTokenInvalid(userId: string, refreshToken: string): Promise<boolean> {
    const user = await this.usersService.findUserByUserId(userId);

    return user.accountData.invalidRefreshTokens.includes(refreshToken);
  }

  async generateNewTokens(
    userId: string,
    login: string,
    email: string,
    deviceId: string,
  ) {
    const AtPayload: JwtATPayload = {
      user: {
        userId,
        login,
        email,
      },
    };
    const RtPayload: JwtRTPayload = {
      user: { userId, login, email },
      deviceId,
    };

    const accessToken = await this.createAccessToken(AtPayload);

    const refreshToken = await this.createRefreshToken(RtPayload);

    await this.securityService.updateSecuritySessionLastActiveDate(deviceId);
    // await this.usersService.addInvalidRefreshToken(userId, refreshToken);

    return {
      access_token: accessToken,
      refresh_token: refreshToken,
    };
  }

  async passwordRecovery(user: UserDocument) {
    const recoveryCode = uuidv4();
    const expirationDate = datefns.add(new Date(), {
      hours: 1,
    });

    await this.usersService.updatePasswordRecoveryData(
      user,
      recoveryCode,
      expirationDate,
    );

    await EmailManager.sendPasswordRecoveryEmail(
      user.accountData.email,
      recoveryCode,
    );
  }

  async userRegistration(registerUserDto: RegisterUserDto) {
    const newUser = await this.usersService.createUser(registerUserDto);
    await EmailManager.sendRegistrationEmail(newUser);
    return newUser;
  }

  async updateConfirmationData(user: UserDocument) {
    const emailConfirmationCode = uuidv4();
    const emailConfirmationExpirationDate = add(new Date(), {
      hours: 1,
    });

    user.setConfirmationCode(emailConfirmationCode);
    user.setConfirmationCodeExpDate(emailConfirmationExpirationDate);

    const updatedUser = await user.save();

    await EmailManager.sendRegistrationEmail(updatedUser);
  }
}
