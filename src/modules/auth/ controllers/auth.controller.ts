import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Request,
  Res,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { LocalAuthGuard } from '../guards/local-auth.guard';
import { AuthService } from '../services/auth.service';
import { Response } from 'express';
import { GetCurrentRTJwtContext } from '../../../shared/decorators/get-Rt-current-user.decorator';
import { JwtRTPayload } from '../interfaces/jwtPayload.type';
import { SecurityService } from '../../security/services/security.service';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { UsersService } from '../../users/services/users.service';
import { PasswordRecoveryDto } from '../dto/passwordRecovery.dto';
import { SetNewPasswordDto } from '../dto/setNewPassword.dto';
import { RegisterUserDto } from '../dto/registerUser.dto';
import { ResendConfirmationDto } from '../dto/resendConfirmation.dto';
import { SkipThrottle, ThrottlerGuard } from '@nestjs/throttler';
import { ConfigService } from '@nestjs/config';
import { JwtRefreshAuthGuard } from '../guards/refresh-auth-guard.guard';
import { CommandBus } from '@nestjs/cqrs';
import { UpdateUserPasswordDataCommand } from '../use-cases/updateUserPasswordData.useCase';
import { ConfirmUserEmailCommand } from '../use-cases/confirmUserEmail.useCase';
import { RegistrationCommand } from '../use-cases/registration.useCase';
import { ResendConfirmationCommand } from '../use-cases/resendConfirmation.useCase';
import { RecoveryUserPasswordCommand } from '../use-cases/recoveryUserPassword.useCase';
import { LoginUserCommand } from '../use-cases/loginUser.useCase';
import { LogoutUserCommand } from '../use-cases/logoutUser.useCase';
import { RefreshTokenCommand } from '../use-cases/refreshToken.useCase';

@Controller('auth')
@SkipThrottle()
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
    private readonly securityService: SecurityService,
    private readonly configService: ConfigService,
    protected commandBus: CommandBus,
  ) {}

  @Post('login')
  @UseGuards(ThrottlerGuard, LocalAuthGuard)
  @HttpCode(HttpStatus.OK)
  async login(@Request() req, @Res({ passthrough: true }) response: Response) {
    if (req.user.banStatus) {
      throw new UnauthorizedException();
    }

    const accessInfo = await this.commandBus.execute(
      new LoginUserCommand(
        req.user.id,
        req.ip,
        req.headers['user-agent'] || 'undefined',
      ),
    );

    response.cookie('refreshToken', accessInfo.refresh_token, {
      httpOnly: this.configService.get<boolean>('test.mode'),
      secure: this.configService.get<boolean>('test.mode'),
    });
    return { accessToken: accessInfo.access_token };
  }

  @Post('logout')
  @UseGuards(JwtRefreshAuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  async logout(
    @GetCurrentRTJwtContext() ctx: JwtRTPayload,
    @Res({ passthrough: true }) response: Response,
  ) {
    if (
      await this.authService.isTokenInvalid(ctx.user.userId, ctx.refreshToken)
    ) {
      throw new UnauthorizedException();
    }

    await this.commandBus.execute(
      new LogoutUserCommand(ctx.user.userId, ctx.deviceId, ctx.refreshToken),
    );

    await response.clearCookie('refreshToken');
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  async authMe(@Request() req) {
    return req.user.user;
  }

  @Post('refresh-token')
  @UseGuards(JwtRefreshAuthGuard)
  @HttpCode(HttpStatus.OK)
  async refreshToken(
    @GetCurrentRTJwtContext() ctx: JwtRTPayload,
    @Res({ passthrough: true }) response: Response,
  ) {
    const securitySession = await this.securityService.getSecuritySessionById(
      ctx.deviceId,
    );

    if (!securitySession) {
      throw new UnauthorizedException();
    }

    if (
      await this.authService.isTokenInvalid(ctx.user.userId, ctx.refreshToken)
    ) {
      throw new UnauthorizedException();
    }

    const accessInfo = await this.commandBus.execute(
      new RefreshTokenCommand(ctx.user.userId, ctx.deviceId, ctx.refreshToken),
    );

    response.cookie('refreshToken', accessInfo.refresh_token, {
      httpOnly: this.configService.get<boolean>('test.mode'),
      secure: this.configService.get<boolean>('test.mode'),
    });
    return { accessToken: accessInfo.access_token };
  }

  // Password recovery

  @Post('password-recovery')
  @UseGuards(ThrottlerGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  async passwordRecovery(@Body() passwordRecoveryDto: PasswordRecoveryDto) {
    const user = await this.usersService.findUserByLoginOrEmail(
      passwordRecoveryDto.email,
    );

    if (!user) {
      return;
    }

    return this.commandBus.execute(
      new RecoveryUserPasswordCommand(passwordRecoveryDto),
    );
  }

  @Post('new-password')
  @UseGuards(ThrottlerGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  async newPassword(@Body() setNewPasswordDto: SetNewPasswordDto) {
    const user = await this.usersService.findUserByRecoveryCode(
      setNewPasswordDto.recoveryCode,
    );

    if (!user) {
      throw new BadRequestException([{ message: 'Wrong recovery code' }]);
    }

    if (user.passwordRecovery.expirationDate < new Date()) {
      throw new BadRequestException([{ message: 'Recovery code is expired' }]);
    }

    await this.commandBus.execute(
      new UpdateUserPasswordDataCommand(setNewPasswordDto),
    );
  }

  // Registration
  @Post('registration')
  @UseGuards(ThrottlerGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  async registration(@Body() registerUserDto: RegisterUserDto) {
    const userLogin = await this.usersService.findUserByLoginOrEmail(
      registerUserDto.login,
    );

    if (userLogin) {
      throw new BadRequestException([
        {
          message: 'User with such login already exist',
          field: 'login',
        },
      ]);
    }

    const userEmail = await this.usersService.findUserByLoginOrEmail(
      registerUserDto.email,
    );

    if (userEmail) {
      throw new BadRequestException([
        {
          message: 'User with such email already exist',
          field: 'email',
        },
      ]);
    }

    return await this.commandBus.execute(
      new RegistrationCommand(registerUserDto),
    );
  }

  @Post('registration-confirmation')
  @UseGuards(ThrottlerGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  async registrationConfirmation(@Body() data: { code: string }) {
    const user = await this.usersService.findUserByConfirmationCode(data.code);

    if (!user) {
      throw new BadRequestException([
        { message: 'Wrong confirmation code', field: 'code' },
      ]);
    }
    if (user.emailConfirmation.expirationDate < new Date()) {
      throw new BadRequestException([
        { message: 'Recovery confirmation code is expired', field: 'code' },
      ]);
    }

    if (user.emailConfirmation.isConfirmed) {
      throw new BadRequestException([
        {
          message: 'Email already confirmed',
          field: 'code',
        },
      ]);
    }

    return await this.commandBus.execute(
      new ConfirmUserEmailCommand(data.code),
    );
  }

  @Post('registration-email-resending')
  @UseGuards(ThrottlerGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  async registrationEmailResending(
    @Body() resendConfirmationDto: ResendConfirmationDto,
  ) {
    const user = await this.usersService.findUserByLoginOrEmail(
      resendConfirmationDto.email,
    );

    console.log(user);

    if (!user) {
      throw new BadRequestException([
        { message: 'Wrong email', field: 'email' },
      ]);
    }

    if (user.emailConfirmation.isConfirmed) {
      throw new BadRequestException([
        { message: 'email already confirmed', field: 'email' },
      ]);
    }

    await this.commandBus.execute(
      new ResendConfirmationCommand(resendConfirmationDto),
    );
  }
}
