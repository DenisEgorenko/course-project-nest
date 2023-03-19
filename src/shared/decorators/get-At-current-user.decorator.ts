import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import {
  JwtATPayload,
  JwtRTPayload,
} from '../../features/auth/interfaces/jwtPayload.type';

export const GetCurrentATJwtContext = createParamDecorator(
  (data: any, context: ExecutionContext): JwtATPayload => {
    const request = context.switchToHttp().getRequest();
    const ctx = request.user as JwtATPayload;
    if (!ctx) {
      throw new Error('AT JWTGuard must be used');
    }

    if (!data) {
      return ctx;
    }

    return ctx[data];
  },
);
