export class PostBaseEntity {
  id: string;
  title: string;
  shortDescription: string;
  content: string;
  createdAt: Date;
  setTitle(title: string) {
    this.title = title;
  }
  setShortDescription(shortDescription: string) {
    this.shortDescription = shortDescription;
  }

  setContent(content: string) {
    this.content = content;
  }
}
