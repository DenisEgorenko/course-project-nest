import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { BanUserBlogStatusDto } from '../core/dto/banUserBlogStatus.dto';
import { IUsersRepository } from '../core/abstracts/users.repository.abstract';
import { IBlogsRepository } from '../../blogs/core/abstracts/blogs.repository.abstract';
import { BlogsBanInfo } from '../infrastructure/postgreSql/model/user.entity';
import { IBlogsBanInfoRepository } from '../../blogs/core/abstracts/blogsBanInfo.repository.abstract';

export class BanUserForBlogCommand {
  constructor(
    public readonly userId: string,
    public readonly banStatusDto: BanUserBlogStatusDto,
  ) {}
}

@CommandHandler(BanUserForBlogCommand)
export class BanUserForBlogHandler
  implements ICommandHandler<BanUserForBlogCommand>
{
  constructor(
    public readonly usersRepository: IUsersRepository,
    public readonly blogsRepository: IBlogsRepository,
    public readonly blogsBanInfoRepository: IBlogsBanInfoRepository,
  ) {}
  async execute(command: BanUserForBlogCommand): Promise<any> {
    const { userId, banStatusDto } = command;

    const user = await this.usersRepository.findUserByUserId(userId);
    const blog = await this.blogsRepository.getBlogById(banStatusDto.blogId);

    const banInfo = await this.blogsBanInfoRepository.findBanInfo(
      userId,
      banStatusDto.blogId,
    );

    if (banInfo) {
      banInfo.isBanned = banStatusDto.isBanned;
      banInfo.banReason = banStatusDto.banReason;
      banInfo.banDate = new Date();

      return await this.blogsBanInfoRepository.save(banInfo);
    }

    const newBanBlogInfo = new BlogsBanInfo();

    newBanBlogInfo.banReason = banStatusDto.banReason;
    newBanBlogInfo.banDate = new Date();
    newBanBlogInfo.isBanned = banStatusDto.isBanned;

    newBanBlogInfo.user = user;
    newBanBlogInfo.blog = blog;

    return await this.blogsBanInfoRepository.save(newBanBlogInfo);
  }
}
