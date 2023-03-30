import { SecurityDocument } from '../infrastructure/mongo/model/security.schema';
import { SecurityBaseEntity } from '../core/entity/security.entity';

export type SecuritySessionsViewModel = {
  ip: string;
  title: string;
  lastActiveDate: string;
  deviceId: string;
};

export const SecuritySessionsToViewModel = (sessions: SecurityBaseEntity[]) =>
  sessions.map((session) => ({
    ip: session.ip,
    title: session.title,
    lastActiveDate: session.lastActiveDate,
    deviceId: session.deviceId,
  }));
