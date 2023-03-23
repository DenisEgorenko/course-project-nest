import { Injectable } from '@nestjs/common';
import { usersQueryModel } from './models/usersQueryModel';
import { Model } from 'mongoose';
import { Sort } from 'mongodb';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument, UserStatics } from '../../db/schemas/user.schema';
import { usersToOutputModel } from './models/usersToViewModel';

@Injectable()
export class UsersQueryRepository {
  constructor(
    @InjectModel(User.name)
    protected userModel: Model<UserDocument> & UserStatics,
  ) {}
  async getAllUsers(query: usersQueryModel) {
    const filterOr: { $or: any[] } = { $or: [] };
    let filterStatus = {};

    if (query.banStatus === 'banned') {
      filterStatus = {
        'accountData.banStatus': true,
      };
    }

    if (query.banStatus === 'notBanned') {
      filterStatus = {
        'accountData.banStatus': false,
      };
    }

    if (query.searchEmailTerm) {
      filterOr.$or.push({
        'accountData.email': new RegExp(query.searchEmailTerm, 'i'),
      });
    }

    if (query.searchLoginTerm) {
      filterOr.$or.push({
        'accountData.login': new RegExp(query.searchLoginTerm, 'i'),
      });
    }

    if (!filterOr.$or.length) {
      filterOr.$or.push({});
    }

    const filter = Object.assign({}, filterOr, filterStatus);

    const sortBy = query.sortBy ? query.sortBy : 'createdAt';
    const sortDirection: Sort = query.sortDirection === 'asc' ? 1 : -1;
    const sort = { ['accountData.' + sortBy]: sortDirection };

    const pageSize: number = query.pageSize ? +query.pageSize : 10;
    const pageNumber: number = query.pageNumber ? +query.pageNumber : 1;

    const skip: number = pageSize * (pageNumber - 1);

    const totalCount = await this.userModel.countDocuments(filterOr);
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
