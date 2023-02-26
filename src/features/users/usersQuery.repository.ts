import { Injectable } from '@nestjs/common';
import { usersQueryModel } from './models/usersQueryModel';
import { Model } from 'mongoose';
import { Sort } from 'mongodb';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument, UserStatics } from './schema/user.schema';
import { usersToOutputModel } from './models/usersToViewModel';

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
    const sort = { ['accountData.' + sortBy]: sortDirection };

    console.log(sort);

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
