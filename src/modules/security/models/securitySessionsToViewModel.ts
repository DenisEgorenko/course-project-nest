import { SecurityDocument } from '../../../db/schemas/security.schema';

export type SecuritySessionsViewModel = {
  ip: string;
  title: string;
  lastActiveDate: string;
  deviceId: string;
};

export const SecuritySessionsToViewModel = (sessions: SecurityDocument[]) =>
  sessions.map((session) => ({
    ip: session.ip,
    title: session.title,
    lastActiveDate: session.lastActiveDate,
    deviceId: session.deviceId,
  }));
