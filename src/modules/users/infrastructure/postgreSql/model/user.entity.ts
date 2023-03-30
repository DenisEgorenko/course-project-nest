import { UserBaseEntity } from '../../../core/entity/user.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  Relation,
} from 'typeorm';
import { Security } from '../../../../security/infrastructure/postgreSql/model/security.entity';

/// Schema

@Entity()
export class InvalidRefreshTokens {
  @PrimaryGeneratedColumn()
  id: string;
  @ManyToOne(() => User, (user) => user.invalidRefreshTokens, {
    onDelete: 'CASCADE',
  })
  user: Relation<User>;
  @Column()
  invalidRefreshToken: string;
}
@Entity()
export class EmailConfirmation {
  @PrimaryGeneratedColumn()
  id: string;
  @Column({ nullable: true })
  confirmationCode: string;
  @Column()
  expirationDate: Date;
  @Column()
  isConfirmed: boolean;
  @OneToOne(() => User, (user) => user.userBanInfo, { onDelete: 'CASCADE' })
  @JoinColumn()
  user: Relation<User>;
}
@Entity()
export class PasswordRecovery {
  @PrimaryGeneratedColumn()
  id: string;
  @Column({ nullable: true })
  recoveryCode: string;
  @Column({ nullable: true })
  expirationDate: Date;
  @OneToOne(() => User, (user) => user.userBanInfo, { onDelete: 'CASCADE' })
  @JoinColumn()
  user: Relation<User>;
}

@Entity()
export class BlogsBanInfo {
  @PrimaryGeneratedColumn()
  id: string;
  @ManyToOne(() => User, (user) => user.blogsBanInfo, {
    onDelete: 'CASCADE',
  })
  user: Relation<User>;
  @Column()
  blogId: string;
  @Column()
  banReason: string;
  @Column()
  banDate: Date;
}
@Entity()
export class UserBanInfo {
  @PrimaryGeneratedColumn()
  id: string;
  @Column()
  banStatus: boolean;
  @Column({ nullable: true })
  banReason: string | null;
  @Column({ nullable: true })
  banDate: Date | null;
  @OneToOne(() => User, (user) => user.userBanInfo, { onDelete: 'CASCADE' })
  @JoinColumn()
  user: Relation<User>;
}

@Entity()
export class User implements UserBaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column()
  login: string;
  @Column()
  email: string;
  @Column()
  password: string;
  @Column()
  salt: string;
  @Column()
  createdAt: Date;

  @OneToOne(() => EmailConfirmation, (conf) => conf.user, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  emailConfirmation: EmailConfirmation;

  @OneToOne(() => PasswordRecovery, (recovery) => recovery.user, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  passwordRecovery: PasswordRecovery;

  @OneToMany(() => BlogsBanInfo, (ban) => ban.user, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  blogsBanInfo: Relation<BlogsBanInfo>[];

  @OneToMany(() => InvalidRefreshTokens, (token) => token.user, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  invalidRefreshTokens: Relation<InvalidRefreshTokens>[];

  @OneToOne(() => UserBanInfo, (ban) => ban.user, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  userBanInfo: UserBanInfo;

  @OneToMany(() => Security, (security) => security.user, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  securitySessions: Relation<Security>[];

  setRecoveryCode(recoveryCode: string) {
    this.passwordRecovery.recoveryCode = recoveryCode;
  }

  setExpirationDate(expirationDate: Date) {
    this.passwordRecovery.expirationDate = expirationDate;
  }

  setUserPassword(password: string) {
    this.password = password;
  }

  setPasswordSalt(salt: string) {
    this.salt = salt;
  }

  setConfirmationCode(code: string | null) {
    this.emailConfirmation.confirmationCode = code;
  }

  setConfirmationCodeExpDate(date: Date | null) {
    this.emailConfirmation.expirationDate = date;
  }

  setIsConfirmed(status: boolean) {
    this.emailConfirmation.isConfirmed = status;
  }

  setBanStatus(banStatus: boolean) {
    this.userBanInfo.banStatus = banStatus;
  }

  setBanReason(reason: string) {
    this.userBanInfo.banReason = reason;
  }

  setBanDate(date: Date) {
    this.userBanInfo.banDate = date;
  }
}
