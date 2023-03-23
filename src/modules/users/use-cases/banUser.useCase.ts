import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument, UserModel } from '../../../db/schemas/user.schema';
import { BanStatusDto } from '../dto/banStatus.dto';
import { SecurityService } from '../../security/security.service';

export class BanUserCommand {
  constructor(
    public readonly user: UserDocument,
    public readonly banStatusDto: BanStatusDto,
  ) {}
}

@CommandHandler(BanUserCommand)
export class BanUSerHandler implements ICommandHandler<BanUserCommand> {
  constructor(
    @InjectModel(User.name)
    protected userModel: UserModel,

    protected securityService: SecurityService,
  ) {}
  async execute(command: BanUserCommand): Promise<any> {
    const { user, banStatusDto } = command;

    if (banStatusDto.isBanned) {
      user.setBanStatus(banStatusDto.isBanned);
      user.setBanReason(banStatusDto.banReason);
      user.setBanDate(new Date());
    } else {
      user.setBanStatus(banStatusDto.isBanned);
      user.setBanReason(null);
      user.setBanDate(null);
    }

    await user.save();

    await this.securityService.removeAllSecuritySessions(user.accountData.id);
  }
}
