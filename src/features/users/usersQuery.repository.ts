import { Injectable } from '@nestjs/common';
import { usersQueryModel } from './models/usersQueryModel';
import { Model } from 'mongoose';
import { Sort } from 'mongodb';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument, UserStatics } from './schema/user.schema';

@Injectable()
export class UsersQueryRepository {
  constructor(
    @InjectModel(User.name)
    protected userModel: Model<UserDocument> & UserStatics,
  ) {}
  async getAllUsers(query: usersQueryModel) {
    const filter: { $or: any[] } = { $or: [] };

    if (query.searchEmailTerm) {
      filter.$or.push({
        'accountData.email': new RegExp(query.searchEmailTerm, 'i'),
      });
    }

    if (query.searchLoginTerm) {
      filter.$or.push({
        'accountData.login': new RegExp(query.searchLoginTerm, 'i'),
      });
    }

    if (!filter.$or.length) {
      filter.$or.push({});
    }

    const sortBy = query.sortBy ? query.sortBy : 'createdAt';
    const sortDirection: Sort = query.sortDirection === 'asc' ? 1 : -1;
    const sort = { [sortBy]: sortDirection };

    const pageSize: number = query.pageSize ? +query.pageSize : 10;
    const pageNumber: number = query.pageNumber ? +query.pageNumber : 1;

    const skip: number = pageSize * (pageNumber - 1);

    const totalCount = await this.userModel.countDocuments(filter);
    const pagesCount = Math.ceil(totalCount / pageSize);

    const items = await this.userModel
      .find(filter)
      .sort(sort)
      .skip(skip)
      .limit(pageSize);

    return usersToOutputModel(
      pagesCount,
      pageNumber,
      pageSize,
      totalCount,
      items,
    );
  }
}

export const usersToOutputModel = (
  pagesCount: number,
  page: number,
  pageSize: number,
  totalCount: number,
  items: UserDocument[],
): usersOutputModel => {
  return {
    pagesCount: pagesCount,
    page: page,
    pageSize: pageSize,
    totalCount: totalCount,
    items: items.map((user) => ({
      id: user.accountData.id,
      login: user.accountData.login,
      email: user.accountData.email,
      createdAt: user.accountData.createdAt,
    })),
  };
};

export type userOutputModel = {
  id: string;
  login: string;
  email: string;
  createdAt: Date;
};

export type usersOutputModel = {
  pagesCount: number;
  page: number;
  pageSize: number;
  totalCount: number;
  items: userOutputModel[];
};
