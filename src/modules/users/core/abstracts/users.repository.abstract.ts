import { UserBaseEntity } from '../entity/user.entity';

export abstract class IUsersRepository {
  abstract save(user: UserBaseEntity);

  // find user functions

  abstract findUserByLoginOrEmail(
    loginOrEmail: string,
  ): Promise<UserBaseEntity>;

  abstract findUserByUserId(userId: string);

  abstract findUserByRecoveryCode(
    recoveryCode: string,
  ): Promise<UserBaseEntity>;

  abstract findUserByConfirmationCode(
    confirmationCode: string,
  ): Promise<UserBaseEntity>;

  // get user's info

  // abstract getAllBannedUsersIds(): Promise<string[]>;
  //
  // abstract getUserStatusForBlog(userId: string, blogId: string);

  // delete user

  abstract deleteUser(id: string);

  abstract clearAllData();
}
