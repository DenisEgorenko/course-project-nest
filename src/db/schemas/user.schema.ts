import { HydratedDocument, Model } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { v4 as uuidv4 } from 'uuid';

/// Types

export type UserDocument = HydratedDocument<User>;

export type UserStatics = {
  createUser: (
    login: string,
    email: string,
    passwordHash: string,
    passwordSalt: string,
    emailConfirmationCode: string,
    emailConfirmationExpirationDate: Date,
    userModel: Model<UserDocument> & UserStatics,
  ) => UserDocument;
};

export type UserModel = Model<UserDocument> & UserStatics;

/// Schema

@Schema({ _id: false })
class AccountData {
  @Prop({ required: true })
  id: string;
  @Prop({ required: true })
  login: string;
  @Prop({ required: true })
  email: string;
  @Prop({ required: true })
  password: string;
  @Prop({ required: true })
  salt: string;
  @Prop({ required: false })
  invalidRefreshTokens: string[];
  @Prop({ required: true })
  banStatus: boolean;
  @Prop({ required: false })
  banReason: string | null;
  @Prop({ required: false })
  banDate: Date | null;
  @Prop({ required: true })
  createdAt: Date;
}
@Schema({ _id: false })
class EmailConfirmation {
  @Prop()
  confirmationCode: string;
  @Prop()
  expirationDate: Date;
  @Prop({ required: true })
  isConfirmed: boolean;
}
@Schema({ _id: false })
class PasswordRecovery {
  @Prop({ required: false })
  recoveryCode: string;
  @Prop({ required: false })
  expirationDate: Date;
}

@Schema({ _id: false })
export class BlogsBanInfo {
  @Prop({ required: true })
  blogId: string;
  @Prop({ required: true })
  banReason: string;
  @Prop({ required: true })
  banDate: Date;
}

@Schema()
export class User {
  @Prop({ required: true })
  accountData: AccountData;

  @Prop({ required: true })
  emailConfirmation: EmailConfirmation;

  @Prop({ required: true })
  passwordRecovery: PasswordRecovery;

  @Prop({ required: true })
  blogsBanInfo: BlogsBanInfo[];

  addInvalidRefreshToken(refreshToken: string) {
    this.accountData.invalidRefreshTokens.push(refreshToken);
  }

  setRecoveryCode(recoveryCode: string) {
    this.passwordRecovery.recoveryCode = recoveryCode;
  }

  setExpirationDate(expirationDate: Date) {
    this.passwordRecovery.expirationDate = expirationDate;
  }

  setUserPassword(password: string) {
    this.accountData.password = password;
  }

  setPasswordSalt(salt: string) {
    this.accountData.salt = salt;
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
    this.accountData.banStatus = banStatus;
  }

  setBanReason(reason: string) {
    this.accountData.banReason = reason;
  }

  setBanDate(date: Date) {
    this.accountData.banDate = date;
  }

  addBlogBanInfo(banInfo: BlogsBanInfo) {
    this.blogsBanInfo.push(banInfo);
  }
}

export const UserSchema = SchemaFactory.createForClass(User);

/// Methods
UserSchema.methods.addInvalidRefreshToken =
  User.prototype.addInvalidRefreshToken;
UserSchema.methods.setRecoveryCode = User.prototype.setRecoveryCode;
UserSchema.methods.setExpirationDate = User.prototype.setExpirationDate;
UserSchema.methods.setUserPassword = User.prototype.setUserPassword;
UserSchema.methods.setPasswordSalt = User.prototype.setPasswordSalt;
UserSchema.methods.setConfirmationCode = User.prototype.setConfirmationCode;
UserSchema.methods.setConfirmationCodeExpDate =
  User.prototype.setConfirmationCodeExpDate;
UserSchema.methods.setIsConfirmed = User.prototype.setIsConfirmed;
UserSchema.methods.setBanStatus = User.prototype.setBanStatus;
UserSchema.methods.setBanReason = User.prototype.setBanReason;
UserSchema.methods.setBanDate = User.prototype.setBanDate;
UserSchema.methods.addBlogBanInfo = User.prototype.addBlogBanInfo;

/// Statics

UserSchema.statics.createUser = (
  login: string,
  email: string,
  passwordHash: string,
  passwordSalt: string,
  emailConfirmationCode: string,
  emailConfirmationExpirationDate: Date,
  userModel: UserModel,
): UserDocument => {
  return new userModel({
    accountData: {
      id: uuidv4(),
      login: login,
      email: email,
      password: passwordHash,
      salt: passwordSalt,
      invalidRefreshTokens: [],
      banStatus: false,
      banReason: null,
      banDate: null,
      createdAt: new Date(),
    },
    emailConfirmation: {
      confirmationCode: emailConfirmationCode,
      expirationDate: emailConfirmationExpirationDate,
      isConfirmed: false,
    },
    passwordRecovery: {
      recoveryCode: null,
      expirationDate: null,
    },
  });
};
