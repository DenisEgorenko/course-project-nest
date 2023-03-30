import {
  Controller,
  Delete,
  ForbiddenException,
  Get,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Param,
  UseGuards,
} from '@nestjs/common';
import { JwtRTPayload } from '../../auth/interfaces/jwtPayload.type';
import { GetCurrentRTJwtContext } from '../../../shared/decorators/get-Rt-current-user.decorator';
import { SecurityService } from '../services/security.service';
import { CommandBus } from '@nestjs/cqrs';
import { JwtRefreshAuthGuard } from '../../auth/guards/refresh-auth-guard.guard';

@Controller('security')
@UseGuards(JwtRefreshAuthGuard)
export class SecurityController {
  constructor(
    private readonly securityService: SecurityService,
    private readonly commandBus: CommandBus,
  ) {}

  // @Post('devices/post/:userId')
  // async post(@Param('userId') userId: string) {
  //   return await this.commandBus.execute(
  //     new CreateSecuritySessionCommand(userId, 'dd', 'dd', 'dd'),
  //   );
  // }

  @Get('devices')
  async getAllActiveSessions(@GetCurrentRTJwtContext() ctx: JwtRTPayload) {
    return await this.securityService.getAllCurrentSecuritySessions(
      ctx.user.userId,
    );
  }

  @Delete('devices')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteAllActiveSessions(@GetCurrentRTJwtContext() ctx: JwtRTPayload) {
    return this.securityService.deleteAllSecuritySessionsExceptCurrent(
      ctx.user.userId,
      ctx.deviceId,
    );
  }

  @Delete('devices/:deviceId')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteSessionById(
    @Param('deviceId') deviceId: string,
    @GetCurrentRTJwtContext() ctx: JwtRTPayload,
  ) {
    const session = await this.securityService.getSecuritySessionById(deviceId);
    if (!session) {
      throw new NotFoundException();
    }
    if (session.userId !== ctx.user.userId) {
      throw new ForbiddenException();
    }
    return this.securityService.deleteSecuritySession(deviceId);
  }
}
