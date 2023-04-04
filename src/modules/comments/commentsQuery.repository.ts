import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { Sort } from 'mongodb';
import { InjectModel } from '@nestjs/mongoose';
import {
  Comment,
  CommentDocument,
} from './infrastructure/mongo/model/comments.schema';
import { CommentsQueryModel } from './models/commentsQueryModel';
import { commentsToOutputModel } from './models/commentsToOutputModel';

@Injectable()
export class CommentsQueryRepository {
  constructor(
    @InjectModel(Comment.name)
    protected commentModel: Model<CommentDocument>,
  ) {}
  async getAllPostComments(
    postId: string,
    query: CommentsQueryModel,
    userId: string,
    bannedUsers: string[],
  ) {
    const sortBy = query.sortBy ? query.sortBy : 'createdAt';
    const sortDirection: Sort = query.sortDirection === 'asc' ? 1 : -1;
    const sort = { [sortBy]: sortDirection };

    const pageSize: number = query.pageSize ? +query.pageSize : 10;
    const pageNumber: number = query.pageNumber ? +query.pageNumber : 1;

    const skip: number = pageSize * (pageNumber - 1);

    const totalCount = await this.commentModel.countDocuments({
      postId: postId,
      userId: { $nin: bannedUsers },
    });
    const pagesCount = Math.ceil(totalCount / pageSize);

    const items = await this.commentModel
      .find({ postId: postId })
      .sort(sort)
      .skip(skip)
      .limit(pageSize);

    const notBannedItems = items.filter(
      (item) => !bannedUsers.includes(item.userId),
    );

    return commentsToOutputModel(query, items, totalCount, userId);
  }
}
