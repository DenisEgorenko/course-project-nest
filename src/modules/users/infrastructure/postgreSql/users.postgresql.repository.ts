import { Injectable } from '@nestjs/common';
import { IUsersRepository } from '../../core/abstracts/users.repository.abstract';
import { Repository } from 'typeorm';
import { InvalidRefreshTokens, User } from './model/user.entity';
import { UserBaseEntity } from '../../core/entity/user.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class UsersPostgreSqlRepository implements IUsersRepository {
  constructor(
    @InjectRepository(User)
    protected usersRepository: Repository<User>,
  ) {}

  // save user entity
  async save(user: UserBaseEntity) {
    return this.usersRepository.save(user);
  }

  // find user functions

  async findUserByUserId(userId: string): Promise<User> {
    return this.usersRepository.findOne({
      relations: {
        userBanInfo: true,
        invalidRefreshTokens: true,
        passwordRecovery: true,
        blogsBanInfo: true,
        emailConfirmation: true,
        securitySessions: true,
        blogs: true,
      },
      where: {
        id: userId,
      },
    });
    // return this.usersRepository.findBy({ 'accountData.id': userId });
  }

  async findUserByLoginOrEmail(loginOrEmail: string): Promise<User> {
    return this.usersRepository.findOne({
      relations: {
        emailConfirmation: true,
        passwordRecovery: true,
        userBanInfo: true,
      },
      where: [
        {
          email: loginOrEmail,
        },
        {
          login: loginOrEmail,
        },
      ],
    });
  }

  async findUserByRecoveryCode(recoveryCode: string): Promise<User> {
    return this.usersRepository.findOne({
      relations: {
        passwordRecovery: true,
      },
      where: {
        passwordRecovery: { recoveryCode },
      },
    });
  }

  async findUserByConfirmationCode(confirmationCode: string): Promise<User> {
    return this.usersRepository.findOne({
      relations: {
        emailConfirmation: true,
      },
      where: {
        emailConfirmation: { confirmationCode },
      },
    });
    // return this.usersRepository.findOne({
    //   'emailConfirmation.confirmationCode': confirmationCode,
    // });
  }

  // get user's info

  // async getAllBannedUsersIds() {
  //   return undefined;
  //   // const users = await this.usersRepository.find({
  //   //   'accountData.banStatus': true,
  //   // });
  //   //
  //   // return users.map((user) => user.accountData.id);
  // }
  //
  // async getUserStatusForBlog(userId: string, blogId: string) {
  //   return undefined;
  //
  //   // const user = await this.findUserByUserId(userId);
  //   //
  //   // return user.blogsBanInfo.filter((ban) => ban.blogId === blogId).length > 0;
  // }

  // delete user

  async deleteUser(id: string) {
    return await this.usersRepository.delete({ id: id });
  }

  async clearAllData() {
    return await this.usersRepository.delete({});
  }
}
