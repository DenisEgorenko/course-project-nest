import {
  BadRequestException,
  Body,
  Controller,
  ForbiddenException,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Request,
  Res,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { AuthService } from './auth.service';
import { Response } from 'express';
import { GetCurrentRTJwtContext } from '../../shared/decorators/get-Rt-current-user.decorator';
import { JwtRTPayload } from './interfaces/jwtPayload.type';
import { SecurityService } from '../security/security.service';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { UsersService } from '../users/users.service';
import { PasswordRecoveryDto } from './dto/passwordRecovery.dto';
import { SetNewPasswordDto } from './dto/setNewPassword.dto';
import { RegisterUserDto } from './dto/registerUser.dto';
import { addUserToOutputModel } from '../users/models/usersToViewModel';
import { ResendConfirmationDto } from './dto/resendConfirmation.dto';
import { ThrottlerGuard } from '@nestjs/throttler';
import { ConfigService } from '@nestjs/config';
import { JwtRefreshAuthGuard } from './guards/refresh-auth-guard.guard';
import { CommandBus } from '@nestjs/cqrs';
import { CreateUserCommand } from '../users/use-cases/createUser.useCase';
import { CreateUserDto } from '../users/dto/createUser.dto';

@Controller('auth')
// @SkipThrottle()
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
    if (req.user.accountData.banStatus) {
      throw new UnauthorizedException();
    }

    const accessInfo = await this.authService.login(
      req.user,
      req.ip,
      req.headers['user-agent'] || 'undefined',
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
    const user = await this.usersService.findUserByLoginOrEmail(ctx.user.login);

    if (
      await this.authService.isTokenInvalid(ctx.user.userId, ctx.refreshToken)
    ) {
      throw new UnauthorizedException();
    }

    await this.authService.logout(
      ctx.deviceId,
      ctx.user.userId,
      ctx.refreshToken,
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

    await this.usersService.addInvalidRefreshToken(
      ctx.user.userId,
      ctx.refreshToken,
    );

    const accessInfo = await this.authService.generateNewTokens(
      ctx.user.userId,
      ctx.user.login,
      ctx.user.email,
      ctx.deviceId,
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

    return this.authService.passwordRecovery(user);
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

    await this.usersService.updateUserPasswordData(
      user,
      setNewPasswordDto.newPassword,
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

    const newUser = await this.commandBus.execute(
      new CreateUserCommand(registerUserDto as CreateUserDto),
    );

    await this.authService.userRegistration(newUser);

    return addUserToOutputModel(newUser);
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
      throw new BadRequestException('email already confirmed');
    }

    await this.usersService.confirmUserEmail(user);
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

    await this.authService.updateConfirmationData(user);
  }
}
