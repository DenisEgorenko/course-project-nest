import { Module } from '@nestjs/common';
import { DataBaseModule } from '../../db/db.module';
import { SecurityController } from './security.controller';
import { SecurityService } from './security.service';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { PasswordService } from '../../application/password.service';

@Module({
  imports: [DataBaseModule],
  controllers: [SecurityController],
  providers: [SecurityService, JwtService, UsersService, PasswordService],
})
export class SecurityModule {}
