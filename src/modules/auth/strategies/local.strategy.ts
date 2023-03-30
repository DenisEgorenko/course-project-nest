import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AuthService } from '../services/auth.service';
import { UsersService } from '../../users/services/users.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly usersService: UsersService) {
    super({ usernameField: 'loginOrEmail' });
  }

  async validate(loginOrEmail: string, password: string): Promise<any> {
    const user = await this.usersService.validateUser(loginOrEmail, password);
    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}
