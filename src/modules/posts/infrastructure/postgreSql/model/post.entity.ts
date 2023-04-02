import {
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  Relation,
} from 'typeorm';
import { Blog } from '../../../../blogs/infrastructure/postgreSql/model/blog.entity';

@Entity()
export class Post {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column()
  title: string;
  @Column()
  shortDescription: string;
  @Column()
  content: string;
  @Column()
  createdAt: Date;

  @ManyToOne(() => Blog, (blog) => blog.posts, {
    onDelete: 'CASCADE',
  })
  blog: Relation<Blog>;

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
