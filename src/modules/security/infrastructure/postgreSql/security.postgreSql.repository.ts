import { Injectable } from '@nestjs/common';
import { Not, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { ISecurityRepository } from '../../core/abstracts/security.repository.abstract';
import { Security } from './model/security.entity';
import { SecurityBaseEntity } from '../../core/entity/security.entity';

@Injectable()
export class SecurityPostgreSqlRepository implements ISecurityRepository {
  constructor(
    @InjectRepository(Security)
    protected securityRepository: Repository<Security>,
  ) {}

  // save user entity
  async save(user: SecurityBaseEntity) {
    return this.securityRepository.save(user);
  }

  async findAllUserSecuritySessions(userId: string) {
    return this.securityRepository.find({
      relations: {
        user: true,
      },
      where: {
        userId,
      },
    });
  }

  async getSecuritySessionById(deviceId: string) {
    return this.securityRepository.findOne({
      relations: {
        user: true,
      },
      where: {
        deviceId: deviceId,
      },
    });
  }

  async deleteSecuritySession(deviceId: string) {
    return this.securityRepository.delete({ deviceId });
  }

  async deleteAllSecuritySessionsExceptCurrent(
    userId: string,
    deviceId: string,
  ) {
    return this.securityRepository.delete({ userId, deviceId: Not(deviceId) });
  }

  async deleteAllSecuritySessions(userId: string) {
    return this.securityRepository.delete({ userId: userId });
  }

  async clearAllData() {
    return this.securityRepository.delete({});
  }
}
