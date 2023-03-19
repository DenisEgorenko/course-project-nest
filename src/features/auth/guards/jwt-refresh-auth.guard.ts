import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Observable } from 'rxjs';

// export class JwtRefreshAuthGuard extends AuthGuard('jwt-refresh') {}
@Injectable()
export class JwtRefreshAuthGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();

    const token = (request.headers.authorization || '').split(' ')[1] || '';

    const jwt = this.jwtService.decode(token, {});

    if (!token || !jwt) {
      request.user = {
        user: {
          userId: null,
          login: null,
          email: null,
        },
      };
      return true;
    }

    request.user = jwt;
    return true;
  }
}
