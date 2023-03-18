import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { JwtRTPayload } from '../../features/auth/interfaces/jwtPayload.type';

export const GetCurrentRTJwtContext = createParamDecorator(
  (data: any, context: ExecutionContext): JwtRTPayload => {
    const request = context.switchToHttp().getRequest();
    const ctx = request.user as JwtRTPayload;

    if (!ctx) {
      throw new Error('JWTGuard must be used');
    }

    if (!data) {
      return ctx;
    }

    return ctx[data];
  },
);
