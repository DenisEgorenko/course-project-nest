import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { UsersService } from './features/users/users.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(protected userService: UsersService) {}
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();

    throw new UnauthorizedException();
  }
}
