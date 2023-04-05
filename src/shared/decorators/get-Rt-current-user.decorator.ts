import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { JwtRTPayload } from '../../modules/auth/interfaces/jwtPayload.type';

export const GetCurrentRTJwtContext = createParamDecorator(
  (data: any, context: ExecutionContext): JwtRTPayload => {
    const request = context.switchToHttp().getRequest();
    const ctx = request.user as JwtRTPayload;

    console.log('context decorator logger', request);

    if (!ctx) {
      throw new Error('RT JWTGuard must be used');
    }

    console.log('after error context decorator logger', request);

    if (!data) {
      return ctx;
    }

    return ctx[data];
  },
);
