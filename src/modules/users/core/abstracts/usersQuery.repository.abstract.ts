import { UserBaseEntity } from '../entity/user.entity';
import { usersQueryModel } from '../models/usersQueryModel';

export abstract class IUsersQueryRepository {
  abstract getAllUsers(query: usersQueryModel, bannedBlogId?: string);
}
