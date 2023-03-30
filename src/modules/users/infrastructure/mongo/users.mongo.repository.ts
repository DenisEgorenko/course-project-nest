import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument, UserStatics } from './model/user.schema';
import { IUsersRepository } from '../../core/abstracts/users.repository.abstract';

@Injectable()
export class UsersMongoRepository implements IUsersRepository {
  constructor(
    @InjectModel(User.name)
    protected userModel: Model<UserDocument> & UserStatics,
  ) {}

  // save user entity
  async save(user: UserDocument) {
    return user.save();
  }

  // find user functions

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

  // get user's info

  // async getAllBannedUsersIds() {
  //   const users = await this.userModel.find({ 'accountData.banStatus': true });
  //
  //   return users.map((user) => user.accountData.id);
  // }
  //
  // async getUserStatusForBlog(userId: string, blogId: string) {
  //   const user = await this.findUserByUserId(userId);
  //
  //   return user.blogsBanInfo.filter((ban) => ban.blogId === blogId).length > 0;
  // }

  // delete user

  async deleteUser(id: string) {
    return await this.userModel.deleteOne({ 'accountData.id': id }).exec();
  }

  async clearAllData() {
    return this.userModel.deleteMany({});
  }
}
