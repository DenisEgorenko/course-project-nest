import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  Relation,
} from 'typeorm';
import {
  BlogsBanInfo,
  User,
} from '../../../../users/infrastructure/postgreSql/model/user.entity';
import { BlogBaseEntity } from '../../../core/entity/blog.entity';
import { Post } from '../../../../posts/infrastructure/postgreSql/model/post.entity';

@Entity()
export class Blog implements BlogBaseEntity {
  @PrimaryGeneratedColumn()
  id: string;
  @Column()
  name: string;
  @Column()
  description: string;
  @Column()
  websiteUrl: string;
  @Column()
  createdAt: Date;
  @Column()
  isBanned: boolean;
  @Column({ nullable: true })
  banDate: Date | null;

  @ManyToOne(() => User, (user) => user.blogs, {
    onDelete: 'CASCADE',
  })
  user: Relation<User>;

  @OneToMany(() => BlogsBanInfo, (ban) => ban.blog, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  blogsBanInfo: Relation<BlogsBanInfo>[];

  @OneToMany(() => Post, (post) => post.blog, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  posts: Relation<Post>[];
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
