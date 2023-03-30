import { Injectable } from '@nestjs/common';
import { IUsersRepository } from '../core/abstracts/users.repository.abstract';
import { UserBaseEntity } from '../core/entity/user.entity';
import { IUsersQueryRepository } from '../core/abstracts/usersQuery.repository.abstract';
import { usersQueryModel } from '../core/models/usersQueryModel';
import { PasswordService } from '../../../application/password.service';

@Injectable()
export class UsersService {
  constructor(
    protected usersRepository: IUsersRepository,
    protected passwordService: PasswordService,
    protected usersQueryRepository: IUsersQueryRepository,
  ) {}

  // find user functions

  async save(user: UserBaseEntity) {
    return this.usersRepository.save(user);
  }

  async validateUser(
    loginOrEmail: string,
    password: string,
  ): Promise<UserBaseEntity> {
    const user = await this.usersRepository.findUserByLoginOrEmail(
      loginOrEmail,
    );

    if (!user) {
      return null;
    }

    const passwordSalt = user.salt;
    const passwordHash = await this.passwordService.generateHash(
      password,
      passwordSalt,
    );

    if (user && user.password === passwordHash) {
      return user;
    }
    return null;
  }

  async getAllUsers(query: usersQueryModel, bannedBlogId?: string) {
    return await this.usersQueryRepository.getAllUsers(query, bannedBlogId);
  }

  async findUserByUserId(userId: string) {
    return this.usersRepository.findUserByUserId(userId);
  }

  async findUserByLoginOrEmail(loginOrEmail: string) {
    return this.usersRepository.findUserByLoginOrEmail(loginOrEmail);
  }

  async findUserByRecoveryCode(recoveryCode: string) {
    return this.usersRepository.findUserByRecoveryCode(recoveryCode);
  }

  async findUserByConfirmationCode(confirmationCode: string) {
    return this.usersRepository.findUserByConfirmationCode(confirmationCode);
  }

  // get user's info
  async getAllBannedUsersIds() {
    return undefined;
    // return await this.usersRepository.getAllBannedUsersIds();
  }

  async getUserStatusForBlog(userId: string, blogId: string) {
    return undefined;
    // return await this.usersRepository.getUserStatusForBlog(userId, blogId);
  }
}
