import { Module } from '@nestjs/common';
import { DataBaseModule } from '../../db/db.module';
import { AuthController } from './auth.controller';
import { UsersModule } from '../users/users.module';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { LocalStrategy } from './strategies/local.strategy';
import { AuthService } from './auth.service';
import { AtJwtStrategy } from './strategies/at.jwt.strategy';
import { UsersService } from '../users/users.service';
import { PasswordService } from '../../application/password.service';
import { SecurityService } from '../security/security.service';
import { RtJwtStrategy } from './strategies/rt.jwt.strategy';
import { ThrottlerModule } from '@nestjs/throttler';

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
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    LocalStrategy,
    AtJwtStrategy,
    RtJwtStrategy,
    UsersService,
    PasswordService,
    SecurityService,
  ],
})
export class AuthModule {}
