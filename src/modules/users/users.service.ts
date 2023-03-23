import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { PasswordService } from '../../application/password.service';
import { User, UserDocument, UserModel } from '../../db/schemas/user.schema';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name)
    protected userModel: UserModel,
    protected passwordService: PasswordService,
  ) {}

  async findUserByLoginOrEmail(loginOrEmail: string): Promise<UserDocument> {
    return this.userModel.findOne({
      $or: [
        { 'accountData.email': loginOrEmail },
        { 'accountData.login': loginOrEmail },
      ],
    });
  }

  async findUserByUserId(userId: string): Promise<UserDocument> {
    return this.userModel.findOne({ 'accountData.id': userId });
  }

  async findUserByRecoveryCode(recoveryCode: string): Promise<UserDocument> {
    return this.userModel.findOne({
      'passwordRecovery.recoveryCode': recoveryCode,
    });
  }

  async findUserByConfirmationCode(
    confirmationCode: string,
  ): Promise<UserDocument> {
    return this.userModel.findOne({
      'emailConfirmation.confirmationCode': confirmationCode,
    });
  }

  async deleteUser(id: string) {
    const user = await this.userModel.find({ 'accountData.id': id });
    if (!user.length) {
      throw new NotFoundException('no such user');
    }
    const deletedUser = await this.userModel
      .deleteOne({ 'accountData.id': id })
      .exec();
    return deletedUser;
  }

  // update functions

  async addInvalidRefreshToken(userId: string, refreshToken: string | null) {
    const users = await this.userModel.find({ 'accountData.id': userId });

    const user = users[0];

    user.addInvalidRefreshToken(refreshToken);

    await user.save();
  }

  async updatePasswordRecoveryData(
    user: UserDocument,
    recoveryCode: string,
    expirationData: Date,
  ) {
    user.setRecoveryCode(recoveryCode);
    user.setExpirationDate(expirationData);

    await user.save();
  }

  async updateUserPasswordData(user: UserDocument, newPassword: string) {
    const passwordSalt = await this.passwordService.generateSalt();
    const passwordHash = await this.passwordService.generateHash(
      newPassword,
      passwordSalt,
    );

    user.setUserPassword(passwordHash);
    user.setPasswordSalt(passwordSalt);
    user.setRecoveryCode(null);
    user.setExpirationDate(null);

    await user.save();
  }

  async confirmUserEmail(user: UserDocument) {
    user.setConfirmationCode(null);
    user.setConfirmationCodeExpDate(null);
    user.setIsConfirmed(true);

    await user.save();
  }

  async getAllBannedUsersIds() {
    const users = await this.userModel.find({ 'accountData.banStatus': true });

    return users.map((user) => user.accountData.id);
  }
}
