import { BlogsBanInfo } from '../../../users/core/entity/user.entity';

export abstract class IBlogsBanInfoRepository {
  abstract save(blog: BlogsBanInfo);

  abstract findBanInfo(userId: string, blogId: string);
}
