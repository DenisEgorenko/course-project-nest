import { ForbiddenException, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Request } from 'express';

@Injectable()
export class RtJwtStrategy extends PassportStrategy(Strategy, 'jwt-refresh') {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (req: Request) => {
          const token = req?.cookies['refreshToken'];
          if (!token) {
            return 'false';
          }
          return token;
        },
      ]),
      ignoreExpiration: true,
      secretOrKey: 'secret',
      passReqToCallback: true,
    });
  }

  async validate(req: Request, payload: any, done) {
    console.log(done);
    const refreshToken = req?.cookies['refreshToken'];

    // if (!refreshToken) {
    //   throw new ForbiddenException('Wrong Refresh Token');
    // }
    return { ...payload };
  }
}
