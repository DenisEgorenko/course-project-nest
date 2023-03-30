import { SecurityBaseEntity } from '../entity/security.entity';

export abstract class ISecurityRepository {
  abstract save(user: SecurityBaseEntity);

  abstract findAllUserSecuritySessions(
    userId: string,
  ): Promise<SecurityBaseEntity[]>;
  abstract getSecuritySessionById(
    deviceId: string,
  ): Promise<SecurityBaseEntity>;

  // delete user

  abstract deleteSecuritySession(deviceId: string);

  abstract deleteAllSecuritySessionsExceptCurrent(
    userId: string,
    deviceId: string,
  );

  abstract deleteAllSecuritySessions(userId: string);

  abstract clearAllData();
}
