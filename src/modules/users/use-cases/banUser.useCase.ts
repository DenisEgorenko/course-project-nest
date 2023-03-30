import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { User } from '../infrastructure/mongo/model/user.schema';
import { BanStatusDto } from '../core/dto/banStatus.dto';
import { SecurityService } from '../../security/services/security.service';
import { IUsersRepository } from '../core/abstracts/users.repository.abstract';
import { UserBaseEntity } from '../core/entity/user.entity';

export class BanUserCommand {
  constructor(
    public readonly userId: string,
    public readonly banStatusDto: BanStatusDto,
  ) {}
}

@CommandHandler(BanUserCommand)
export class BanUserHandler implements ICommandHandler<BanUserCommand> {
  constructor(public readonly usersRepository: IUsersRepository) {}
  async execute(command: BanUserCommand): Promise<any> {
    const { userId, banStatusDto } = command;

    const user = await this.usersRepository.findUserByUserId(userId);

    if (banStatusDto.isBanned) {
      user.setBanStatus(banStatusDto.isBanned);
      user.setBanReason(banStatusDto.banReason);
      user.setBanDate(new Date());
    } else {
      user.setBanStatus(banStatusDto.isBanned);
      user.setBanReason(null);
      user.setBanDate(null);
    }

    await this.usersRepository.save(user);

    // await this.securityService.removeAllSecuritySessions(user.id);
  }
}
