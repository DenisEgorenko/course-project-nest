import { Injectable } from '@nestjs/common';
import { usersQueryModel } from '../../core/models/usersQueryModel';
import { Sort } from 'mongodb';
import { InjectRepository } from '@nestjs/typeorm';
import { Brackets, Repository } from 'typeorm';
import { User, UserBanInfo } from './model/user.entity';

@Injectable()
export class UsersPostgreSqlQueryRepository {
  constructor(
    @InjectRepository(User)
    protected usersRepository: Repository<User>,
  ) {}
  async getAllUsers(query: usersQueryModel, bannedBlogId?: string) {
    const sortBy = query.sortBy ? query.sortBy : 'createdAt';
    const sortDirection = query.sortDirection === 'asc' ? 'ASC' : 'DESC';

    const pageSize: number = query.pageSize ? +query.pageSize : 10;
    const pageNumber: number = query.pageNumber ? +query.pageNumber : 1;

    const skip: number = pageSize * (pageNumber - 1);

    const items = await this.usersRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.userBanInfo', 'banInfo')
      .where((qb) => {
        if (query.banStatus && query.banStatus !== 'all') {
          qb.where('banInfo.banStatus = :banStatus', {
            banStatus: query.banStatus === 'banned',
          });
        } else {
          return;
        }
      })
      .andWhere(
        new Brackets((qb) => {
          const queryArray = [];

          if (query.searchLoginTerm) {
            queryArray.push({
              field: 'login',
              value: query.searchLoginTerm,
            });
          }

          if (query.searchEmailTerm) {
            queryArray.push({
              field: 'email',
              value: query.searchEmailTerm,
            });
          }

          if (queryArray.length) {
            queryArray.map((value) => {
              qb.orWhere(`user.${value.field} ILIKE :${value.field}`, {
                [`${value.field}`]: `%${value.value}%`,
              });
            });
          } else {
            return;
          }
        }),
      )
      .orderBy(`user.${sortBy}`, sortDirection)
      .limit(pageSize)
      .offset(skip)
      .getMany();

    const totalCount = await this.usersRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.userBanInfo', 'banInfo')
      .where((qb) => {
        if (query.banStatus && query.banStatus !== 'all') {
          qb.where('banInfo.banStatus = :banStatus', {
            banStatus: query.banStatus === 'banned',
          });
        } else {
          return;
        }
      })
      .andWhere(
        new Brackets((qb) => {
          const queryArray = [];

          if (query.searchLoginTerm) {
            queryArray.push({
              field: 'login',
              value: query.searchLoginTerm,
            });
          }

          if (query.searchEmailTerm) {
            queryArray.push({
              field: 'email',
              value: query.searchEmailTerm,
            });
          }

          if (queryArray.length) {
            queryArray.map((value) => {
              qb.orWhere(`user.${value.field} ILIKE :${value.field}`, {
                [`${value.field}`]: `%${value.value}%`,
              });
            });
          } else {
            return;
          }
        }),
      )
      .getCount();

    return { items, totalCount };
  }
}
