import { JwtATPayload, JwtRTPayload } from '../interfaces/jwtPayload.type';
import { JwtService } from '@nestjs/jwt';
import { Injectable } from '@nestjs/common';

@Injectable()
export class JwtTokenManager {
  constructor(protected jwtService: JwtService) {}
  async createRefreshToken(payload: JwtRTPayload) {
    return this.jwtService.sign(payload, { expiresIn: '20s' });
  }

  async createAccessToken(payload: JwtATPayload) {
    return this.jwtService.sign(payload, { expiresIn: '10s' });
  }
}