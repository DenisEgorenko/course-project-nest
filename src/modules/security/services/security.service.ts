import { SecuritySessionsToViewModel } from '../models/securitySessionsToViewModel';
import { ISecurityRepository } from '../core/abstracts/security.repository.abstract';
import { Injectable } from '@nestjs/common';
import { Not } from 'typeorm';

@Injectable()
export class SecurityService {
  constructor(protected securityRepository: ISecurityRepository) {}

  async getAllCurrentSecuritySessions(userId: string) {
    return SecuritySessionsToViewModel(
      await this.securityRepository.findAllUserSecuritySessions(userId),
    );
  }

  async getSecuritySessionById(deviceId: string) {
    return this.securityRepository.getSecuritySessionById(deviceId);
  }

  async deleteAllSecuritySessionsExceptCurrent(
    userId: string,
    deviceId: string,
  ) {
    return this.securityRepository.deleteAllSecuritySessionsExceptCurrent(
      userId,
      deviceId,
    );
  }

  async deleteSecuritySession(deviceId: string) {
    return this.securityRepository.deleteSecuritySession(deviceId);
  }
}
