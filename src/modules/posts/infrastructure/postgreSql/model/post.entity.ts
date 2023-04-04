import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  Relation,
} from 'typeorm';
import { Blog } from '../../../../blogs/infrastructure/postgreSql/model/blog.entity';
import { User } from '../../../../users/infrastructure/postgreSql/model/user.entity';
import { Comment } from '../../../../comments/infrastructure/postgreSql/model/comments.entity';

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

  @OneToMany(() => PostLike, (postLike) => postLike.post, {
    onDelete: 'CASCADE',
  })
  postLikes: Relation<PostLike>[];

  @OneToMany(() => Comment, (comment) => comment.post, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  comments: Relation<Comment>[];

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

@Entity()
export class PostLike {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  createdAt: Date;

  @Column()
  likeStatus: string;

  @ManyToOne(() => Post, (post) => post.postLikes, {
    onDelete: 'CASCADE',
  })
  post: Relation<Post>;

  @ManyToOne(() => User, (user) => user.postLikes, {
    onDelete: 'CASCADE',
  })
  user: Relation<User>;
}
