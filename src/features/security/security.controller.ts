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
import { JwtRefreshAuthGuard } from '../auth/guards/jwt-refresh-auth.guard';
import { JwtRTPayload } from '../auth/interfaces/jwtPayload.type';
import { GetCurrentRTJwtContext } from '../../shared/decorators/get-Rt-current-user.decorator';
import { SecurityService } from './security.service';

@Controller('security')
@UseGuards(JwtRefreshAuthGuard)
export class SecurityController {
  constructor(private readonly securityService: SecurityService) {}

  @Get('devices')
  async getAllActiveSessions(@GetCurrentRTJwtContext() ctx: JwtRTPayload) {
    return await this.securityService.getAllCurrentSecuritySessions(
      ctx.user.userId,
    );
  }

  @Delete('devices')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteAllActiveSessions(@GetCurrentRTJwtContext() ctx: JwtRTPayload) {
    return this.securityService.removeAllSecuritySessionsExceptCurrent(
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
    return this.securityService.removeSecuritySession(deviceId);
  }
}
