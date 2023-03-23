import { v4 as uuidv4 } from 'uuid';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import {
  Security,
  SecurityDocument,
  SecurityModel,
} from '../../db/schemas/security.schema';
import { UsersService } from '../users/users.service';
import { JwtRTPayload } from '../auth/interfaces/jwtPayload.type';
import { SecuritySessionsToViewModel } from './models/securitySessionsToViewModel';
export class SecurityService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly usersService: UsersService,
    @InjectModel(Security.name)
    protected securityModel: SecurityModel,
  ) {}

  async createSecuritySession(
    userId: string,
    ip: string,
    title: string,
    deviceId: string,
  ) {
    const newSecuritySession = await this.securityModel.createSecuritySession(
      ip,
      title,
      deviceId,
      userId,
      this.securityModel,
    );

    await newSecuritySession.save();
  }

  async getAllCurrentSecuritySessions(userId: string) {
    return SecuritySessionsToViewModel(
      await this.securityModel.find({ userId }),
    );
  }

  async getSecuritySessionById(deviceId: string) {
    const session = await this.securityModel.findOne({ deviceId });
    return session;
  }

  async removeSecuritySession(deviceId: string) {
    return this.securityModel.deleteOne({ deviceId });
  }

  async removeAllSecuritySessionsExceptCurrent(
    userId: string,
    deviceId: string,
  ) {
    return this.securityModel.deleteMany({
      userId,
      deviceId: { $ne: deviceId },
    });
  }

  async removeAllSecuritySessions(userId: string) {
    return this.securityModel.deleteMany({
      userId,
    });
  }

  async updateSecuritySessionLastActiveDate(deviceId: string) {
    const securitySession = await this.getSecuritySessionById(deviceId);
    await securitySession.updateLastActiveDate();
    return await securitySession.save();
  }
}
