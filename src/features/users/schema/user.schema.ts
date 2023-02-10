import { HydratedDocument, Model } from 'mongoose';
import { Prop, raw, Schema, SchemaFactory } from '@nestjs/mongoose';
import { v4 as uuidv4 } from 'uuid';
import { add } from 'date-fns';

export type UserDocument = HydratedDocument<User>;

@Schema()
export class User {
  @Prop(
    raw({
      id: { type: String, required: true },
      login: { type: String, required: true },
      email: { type: String, required: true },
      password: { type: String, required: true },
      salt: { type: String, required: true },
      refreshToken: { type: String, required: false },
      createdAt: { type: Date, required: true },
    }),
  )
  accountData: Record<string, any>;

  @Prop(
    raw({
      confirmationCode: { type: String, required: false },
      expirationDate: { type: Date, required: false },
      isConfirmed: { type: Boolean, required: false },
    }),
  )
  emailConfirmation: Record<string, any>;

  @Prop(
    raw({
      recoveryCode: { type: String, required: false },
      expirationDate: { type: Date, required: false },
    }),
  )
  passwordRecovery: Record<string, any>;
}

export type UserStatics = {
  createUser: (
    login: string,
    email: string,
    passwordHash: string,
    passwordSalt: string,
    userModel: Model<UserDocument> & UserStatics,
  ) => UserDocument;
};

export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.statics.createUser = (
  login: string,
  email: string,
  passwordHash: string,
  passwordSalt: string,
  userModel: Model<UserDocument> & UserStatics,
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

UserSchema.methods = {};
