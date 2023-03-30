export class SecurityBaseEntity {
  ip: string;

  title: string;

  lastActiveDate: Date;

  deviceId: string;

  userId: string;

  updateLastActiveDate() {
    this.lastActiveDate = new Date();
  }
}
