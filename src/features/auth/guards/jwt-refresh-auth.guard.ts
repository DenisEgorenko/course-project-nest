import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { JwtService } from '@nestjs/jwt';
import { Observable } from 'rxjs';
import { DecodedJwtRTPayload } from '../interfaces/jwtPayload.type';

@Injectable()
// export class JwtRefreshAuthGuard extends AuthGuard('jwt-refresh') {}
export class JwtRefreshAuthGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = request.cookies['refreshToken'];

    if (!token) {
      request.user = {
        user: {
          userId: null,
          login: null,
          email: null,
        },
      };
      return true;
    }

    const jwt = this.jwtService.decode(token, {});

    request.user = jwt;
    return true;
  }
}