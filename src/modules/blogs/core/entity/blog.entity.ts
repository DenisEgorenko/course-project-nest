export class BlogBaseEntity {
  id: string;
  name: string;
  description: string;
  websiteUrl: string;
  createdAt: Date;
  isBanned: boolean;
  banDate: Date | null;

  setName(name: string) {
    this.name = name;
  }

  setDescription(description: string) {
    this.description = description;
  }

  setWebsiteUrl(websiteUrl: string) {
    this.websiteUrl = websiteUrl;
  }

  setIsBanned(isBanned: boolean) {
    this.isBanned = isBanned;
  }

  setBannedDate(date: Date) {
    this.banDate = date;
  }
}
