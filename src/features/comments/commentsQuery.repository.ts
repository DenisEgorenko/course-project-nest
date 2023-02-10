import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { Sort } from 'mongodb';
import { InjectModel } from '@nestjs/mongoose';
import { Comment, CommentDocument } from './schema/comments.schema';
import { commentsQueryModel } from './models/commentsQueryModel';
import { LikesModel } from '../../likes/likesModel';

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
  ) {
    const sortBy = query.sortBy ? query.sortBy : 'createdAt';
    const sortDirection: Sort = query.sortDirection === 'asc' ? 1 : -1;
    const sort = { [sortBy]: sortDirection };

    const pageSize: number = query.pageSize ? +query.pageSize : 10;
    const pageNumber: number = query.pageNumber ? +query.pageNumber : 1;

    const skip: number = pageSize * (pageNumber - 1);

    const totalCount = await this.commentModel.countDocuments({
      postId: postId,
    });
    const pagesCount = Math.ceil(totalCount / pageSize);

    const items = await this.commentModel
      .find({ postId: postId })
      .sort(sort)
      .skip(skip)
      .limit(pageSize);

    return commentsToOutputModel(
      pagesCount,
      pageNumber,
      pageSize,
      totalCount,
      items,
      userId,
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
): commentsOutputModel => {
  return {
    pagesCount: pagesCount,
    page: page,
    pageSize: pageSize,
    totalCount: totalCount,
    items: items.map((comment) => commentToOutputModel(comment, userId)),
  };
};

export const commentToOutputModel = (
  item: CommentDocument,
  userId: string,
): commentOutputModel => {
  // const likeStatus

  return {
    id: item.id,
    content: item.content,
    commentatorInfo: {
      userId: item.userId,
      userLogin: item.userLogin,
    },
    createdAt: item.createdAt,
    likesInfo: {
      likesCount: item.likesInfo.likes.length,
      dislikesCount: item.likesInfo.dislikes.length,
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
