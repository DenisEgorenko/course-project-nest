import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectModel } from '@nestjs/mongoose';
import {
  BlogsBanInfo,
  User,
  UserDocument,
  UserModel,
} from '../../../db/schemas/user.schema';
import { BanStatusDto } from '../dto/banStatus.dto';
import { SecurityService } from '../../security/security.service';
import { BanUserBlogStatusDto } from '../dto/banUserBlogStatus.dto';

export class BanUserForBlogCommand {
  constructor(
    public readonly user: UserDocument,
    public readonly banStatusDto: BanUserBlogStatusDto,
  ) {}
}

@CommandHandler(BanUserForBlogCommand)
export class BanUserForBlogHandler
  implements ICommandHandler<BanUserForBlogCommand>
{
  constructor(
    @InjectModel(User.name)
    protected userModel: UserModel,
  ) {}
  async execute(command: BanUserForBlogCommand): Promise<any> {
    const { user, banStatusDto } = command;

    if (banStatusDto.isBanned) {
      const banEntity: BlogsBanInfo = {
        blogId: banStatusDto.blogId,
        banDate: new Date(),
        banReason: banStatusDto.banReason,
      };

      user.addBlogBanInfo(banEntity);
    } else {
      const filtered = user.blogsBanInfo.filter(
        (ban) => ban.blogId !== banStatusDto.blogId,
      );

      user.blogsBanInfo = filtered;
    }

    await user.save();
  }
}
