import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { Sort } from 'mongodb';
import { InjectModel } from '@nestjs/mongoose';
import { Comment, CommentDocument } from '../../db/schemas/comments.schema';
import { commentsQueryModel } from './models/commentsQueryModel';
import { LikesModel } from 'src/common/models/likesModel';

@Injectable()
export class CommentsQueryRepository {
  constructor(
    @InjectModel(Comment.name)
    protected commentModel: Model<CommentDocument>,
  ) {}
  async getAllPostComments(
    postId: string,
    query: commentsQueryModel,
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

    return commentsToOutputModel(
      pagesCount,
      pageNumber,
      pageSize,
      totalCount,
      notBannedItems,
      userId,
      bannedUsers,
    );
  }
}

export const commentsToOutputModel = (
  pagesCount: number,
  page: number,
  pageSize: number,
  totalCount: number,
  items: CommentDocument[],
  userId: string,
  bannedUsers: string[],
): commentsOutputModel => {
  return {
    pagesCount: pagesCount,
    page: page,
    pageSize: pageSize,
    totalCount: totalCount,
    items: items.map((comment) =>
      commentToOutputModel(comment, userId, bannedUsers),
    ),
  };
};

export const commentToOutputModel = (
  item: CommentDocument,
  userId: string,
  bannedUsers: string[],
): commentOutputModel => {
  const likes = item.likesInfo.likes.filter(
    (like) => !bannedUsers.includes(like),
  );

  const dislikes = item.likesInfo.dislikes.filter(
    (dislike) => !bannedUsers.includes(dislike),
  );

  return {
    id: item.id,
    content: item.content,
    commentatorInfo: {
      userId: item.userId,
      userLogin: item.userLogin,
    },
    createdAt: item.createdAt,
    likesInfo: {
      likesCount: likes.length,
      dislikesCount: dislikes.length,
      myStatus: item.likesInfo.likes.includes(userId)
        ? LikesModel.Like
        : item.likesInfo.dislikes.includes(userId)
        ? LikesModel.Dislike
        : LikesModel.None,
    },
  };
};

export type commentsOutputModel = {
  pagesCount: number;
  page: number;
  pageSize: number;
  totalCount: number;
  items: commentOutputModel[];
};

export type commentOutputModel = {
  id: string;
  content: string;

  commentatorInfo: {
    userId: string;
    userLogin: string;
  };
  createdAt: Date;
  likesInfo: {
    likesCount: number;
    dislikesCount: number;
    myStatus: LikesModel;
  };
};
