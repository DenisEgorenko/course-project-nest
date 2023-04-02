import { BlogBaseEntity } from '../../../blogs/core/entity/blog.entity';

class EmailConfirmation {
  id: string;
  confirmationCode: string | null;
  expirationDate: Date | null;
  isConfirmed: boolean;
}
class PasswordRecovery {
  constructor() {
    this.recoveryCode = null;
    this.expirationDate = null;
  }
  id: string;
  recoveryCode: string | null;
  expirationDate: Date | null;
}

export class BlogsBanInfo {
  id: string;
  banReason: string;
  isBanned: boolean;
  banDate: Date;
}

export class UserBanInfo {
  constructor() {
    this.banStatus = false;
    this.banDate = null;
    this.banReason = null;
  }
  id: string;
  banStatus: boolean;
  banReason: string | null;
  banDate: Date | null;
}

export class InvalidRefreshTokens {
  id: string;
  invalidRefreshToken: string;
}

export class UserBaseEntity {
  constructor() {
    this.emailConfirmation = new EmailConfirmation();
    this.userBanInfo = new UserBanInfo();
    this.passwordRecovery = new PasswordRecovery();
  }

  id: string;
  login: string;
  email: string;
  password: string;
  salt: string;
  createdAt: Date;

  emailConfirmation: EmailConfirmation;

  passwordRecovery: PasswordRecovery;

  invalidRefreshTokens: InvalidRefreshTokens[];

  blogsBanInfo: BlogsBanInfo[];

  userBanInfo: UserBanInfo;

  setRecoveryCode(recoveryCode: string) {
    this.passwordRecovery.recoveryCode = recoveryCode;
  }

  setExpirationDate(expirationDate: Date) {
    this.passwordRecovery.expirationDate = expirationDate;
  }

  setUserPassword(password: string) {
    this.password = password;
  }

  setPasswordSalt(salt: string) {
    this.salt = salt;
  }

  setConfirmationCode(code: string | null) {
    this.emailConfirmation.confirmationCode = code;
  }

  setConfirmationCodeExpDate(date: Date | null) {
    this.emailConfirmation.expirationDate = date;
  }

  setIsConfirmed(status: boolean) {
    this.emailConfirmation.isConfirmed = status;
  }

  setBanStatus(banStatus: boolean) {
    this.userBanInfo.banStatus = banStatus;
  }

  setBanReason(reason: string) {
    this.userBanInfo.banReason = reason;
  }

  setBanDate(date: Date) {
    this.userBanInfo.banDate = date;
  }
}
