import { SecurityBaseEntity } from '../../../core/entity/security.entity';
import {
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  Relation,
} from 'typeorm';
import { User } from '../../../../users/infrastructure/postgreSql/model/user.entity';

@Entity()
export class Security implements SecurityBaseEntity {
  @PrimaryGeneratedColumn()
  id: string;

  @Column()
  ip: string;

  @Column()
  title: string;

  @Column()
  lastActiveDate: Date;

  @Column()
  deviceId: string;

  @Column()
  userId: string;

  @ManyToOne(() => User, (user) => user.securitySessions, {
    onDelete: 'CASCADE',
  })
  user: Relation<User>;

  updateLastActiveDate() {
    this.lastActiveDate = new Date();
  }
}
