import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { CreateUserDto } from './dto/createUser.dto';
import { PasswordService } from '../../application/password.service';
import { User, UserDocument, UserModel } from './schema/user.schema';
import { userToOutputModel } from './models/usersToViewModel';
import { v4 as uuidv4 } from 'uuid';
import { add } from 'date-fns';
@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name)
    protected userModel: UserModel,
    protected passwordService: PasswordService,
  ) {}

  async createUser(createUserDto: CreateUserDto) {
    const passwordSalt = await this.passwordService.generateSalt();
    const passwordHash = await this.passwordService.generateHash(
      createUserDto.password,
      passwordSalt,
    );

    const emailConfirmationCode = uuidv4();
    const emailConfirmationExpirationDate = add(new Date(), {
      hours: 1,
    });

    const newUser = await this.userModel.createUser(
      createUserDto.login,
      createUserDto.email,
      passwordHash,
      passwordSalt,
      emailConfirmationCode,
      emailConfirmationExpirationDate,
      this.userModel,
    );

    const createdUser = await newUser.save();

    return createdUser;
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

  // update functions

  async addInvalidRefreshToken(userId: string, refreshToken: string | null) {
    const users = await this.userModel.find({ 'accountData.id': userId });

    const user = users[0];

    user.addInvalidRefreshToken(refreshToken);

    await user.save();
  }

  async findInvalidUsersTokens(userId: string) {
    return this.userModel.findOne({});
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
}
