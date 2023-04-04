import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  Relation,
} from 'typeorm';
import { Post } from '../../../../posts/infrastructure/postgreSql/model/post.entity';
import { User } from '../../../../users/infrastructure/postgreSql/model/user.entity';

@Entity()
export class Comment {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column()
  content: string;
  @Column()
  createdAt: Date;

  @ManyToOne(() => User, (user) => user.comments, {
    onDelete: 'CASCADE',
  })
  user: Relation<User>;

  @ManyToOne(() => Post, (post) => post.comments, {
    onDelete: 'CASCADE',
  })
  post: Relation<Post>;

  @OneToMany(() => CommentLike, (commentsLike) => commentsLike.comment, {
    onDelete: 'CASCADE',
  })
  commentsLikes: Relation<CommentLike>[];
}

@Entity()
export class CommentLike {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  createdAt: Date;

  @Column()
  likeStatus: string;

  @ManyToOne(() => Comment, (comment) => comment.commentsLikes, {
    onDelete: 'CASCADE',
  })
  comment: Relation<Comment>;

  @ManyToOne(() => User, (user) => user.commentsLikes, {
    onDelete: 'CASCADE',
  })
  user: Relation<User>;
}
