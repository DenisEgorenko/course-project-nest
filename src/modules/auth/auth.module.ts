import { Module } from '@nestjs/common';
import { DataBaseModule } from '../../db/db.module';
import { AuthController } from './ controllers/auth.controller';
import { UsersModule } from '../users/users.module';
import { PassportModule } from '@nestjs/passport';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { LocalStrategy } from './strategies/local.strategy';
import { AuthService } from './services/auth.service';
import { AtJwtStrategy } from './strategies/at.jwt.strategy';
import { PasswordService } from '../../application/password.service';
import { SecurityService } from '../security/services/security.service';
import { RtJwtStrategy } from './strategies/rt.jwt.strategy';
import { ThrottlerModule } from '@nestjs/throttler';
import { CqrsModule } from '@nestjs/cqrs';
import { RegistrationHandler } from './use-cases/registration.useCase';
import { ResendConfirmationHandler } from './use-cases/resendConfirmation.useCase';
import { RecoveryUserPasswordHandler } from './use-cases/recoveryUserPassword.useCase';
import { UpdateUserPasswordDataHandler } from './use-cases/updateUserPasswordData.useCase';
import { LoginUserHandler } from './use-cases/loginUser.useCase';
import { SecurityModule } from '../security/security.module';
import { JwtTokenManager } from './jwt-manager/jwt-token.manager';
import { LogoutUserHandler } from './use-cases/logoutUser.useCase';
import { RefreshTokenHandler } from './use-cases/refreshToken.useCase';

const handlers = [
  RegistrationHandler,
  ResendConfirmationHandler,
  RecoveryUserPasswordHandler,
  UpdateUserPasswordDataHandler,
  LoginUserHandler,
  LogoutUserHandler,
  RefreshTokenHandler,
];
@Module({
  imports: [
    DataBaseModule,
    UsersModule,
    PassportModule,
    JwtModule.register({
      secret: 'secret',
    }),
    ThrottlerModule.forRoot({
      ttl: 10,
      limit: 5,
    }),
    CqrsModule,
    SecurityModule,
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    LocalStrategy,
    AtJwtStrategy,
    RtJwtStrategy,
    PasswordService,
    SecurityService,
    JwtTokenManager,
    ...handlers,
  ],
})
export class AuthModule {}
