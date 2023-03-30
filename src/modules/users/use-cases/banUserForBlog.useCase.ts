import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import {
  BlogsBanInfo,
  UserDocument,
} from '../infrastructure/mongo/model/user.schema';
import { BanUserBlogStatusDto } from '../core/dto/banUserBlogStatus.dto';
import { IUsersRepository } from '../core/abstracts/users.repository.abstract';

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
  constructor(public readonly usersRepository: IUsersRepository) {}
  async execute(command: BanUserForBlogCommand): Promise<any> {
    const { user, banStatusDto } = command;

    // if (banStatusDto.isBanned) {
    //   const banEntity: BlogsBanInfo = {
    //     blogId: banStatusDto.blogId,
    //     banDate: new Date(),
    //     banReason: banStatusDto.banReason,
    //   };
    //
    //   user.addBlogBanInfo(banEntity);
    // } else {
    //   const filtered = user.blogsBanInfo.filter(
    //     (ban) => ban.blogId !== banStatusDto.blogId,
    //   );
    //
    //   user.blogsBanInfo = filtered;
    // }

    await this.usersRepository.save(user);
  }
}
