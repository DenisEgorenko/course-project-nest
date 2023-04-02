import { UserBaseEntity } from '../entity/user.entity';

export abstract class IUsersRepository {
  abstract save(user: UserBaseEntity);

  // find user functions

  abstract findUserByLoginOrEmail(loginOrEmail: string);

  abstract findUserByUserId(userId: string);

  abstract findUserByRecoveryCode(recoveryCode: string);

  abstract findUserByConfirmationCode(confirmationCode: string);

  // get user's info

  // abstract getAllBannedUsersIds(): Promise<string[]>;
  //
  // abstract getUserStatusForBlog(userId: string, blogId: string);

  // delete user

  abstract deleteUser(id: string);

  abstract clearAllData();
}
