import { HydratedDocument, Model } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { v4 as uuidv4 } from 'uuid';
import { add } from 'date-fns';

/// Types

export type UserDocument = HydratedDocument<User>;

export type UserStatics = {
  createUser: (
    login: string,
    email: string,
    passwordHash: string,
    passwordSalt: string,
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
  refreshToken: string;
  @Prop({ required: true })
  createdAt: Date;
}
@Schema({ _id: false })
class EmailConfirmation {
  @Prop({ required: true })
  confirmationCode: string;
  @Prop({ required: true })
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

@Schema()
export class User {
  @Prop({ required: true })
  accountData: AccountData;

  @Prop({ required: true })
  emailConfirmation: EmailConfirmation;

  @Prop({ required: true })
  passwordRecovery: PasswordRecovery;
}

export const UserSchema = SchemaFactory.createForClass(User);

/// Methods

/// Statics

UserSchema.statics.createUser = (
  login: string,
  email: string,
  passwordHash: string,
  passwordSalt: string,
  userModel: UserModel,
): UserDocument => {
  return new userModel({
    accountData: {
      id: uuidv4(),
      login: login,
      email: email,
      password: passwordHash,
      salt: passwordSalt,
      refreshToken: null,
      createdAt: new Date(),
    },
    emailConfirmation: {
      confirmationCode: uuidv4(),
      expirationDate: add(new Date(), {
        hours: 1,
      }),
      isConfirmed: false,
    },
    passwordRecovery: {
      recoveryCode: null,
      expirationDate: null,
    },
  });
};
