import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { Sort } from 'mongodb';
import { InjectModel } from '@nestjs/mongoose';
import { Post, PostDocument, PostStatics } from './schema/post.schema';
import { postsQueryModel } from './models/postsQueryModel';
import { LikesModel } from '../likes/likesModel';

@Injectable()
export class PostsQueryRepository {
  constructor(
    @InjectModel(Post.name)
    protected postModel: Model<PostDocument> & PostStatics,
  ) {}
  async getAllPosts(query: postsQueryModel, userId: string) {
    const sortBy = query.sortBy ? query.sortBy : 'createdAt';
    const sortDirection: Sort = query.sortDirection === 'asc' ? 1 : -1;
    const sort = { [sortBy]: sortDirection };

    const pageSize: number = query.pageSize ? +query.pageSize : 10;
    const pageNumber: number = query.pageNumber ? +query.pageNumber : 1;

    const skip: number = pageSize * (pageNumber - 1);

    const totalCount = await this.postModel.countDocuments({});
    const pagesCount = Math.ceil(totalCount / pageSize);

    const items = await this.postModel
      .find({})
      .sort(sort)
      .skip(skip)
      .limit(pageSize);

    return postsToOutputModel(
      pagesCount,
      pageNumber,
      pageSize,
      totalCount,
      items,
      userId,
    );
  }

  async getAllBlogsPosts(
    blogId: string,
    query: postsQueryModel,
    userId: string,
  ) {
    const sortBy = query.sortBy ? query.sortBy : 'createdAt';
    const sortDirection: Sort = query.sortDirection === 'asc' ? 1 : -1;
    const sort = { [sortBy]: sortDirection };

    const pageSize: number = query.pageSize ? +query.pageSize : 10;
    const pageNumber: number = query.pageNumber ? +query.pageNumber : 1;

    const skip: number = pageSize * (pageNumber - 1);

    const totalCount = await this.postModel.countDocuments({ blogId: blogId });
    const pagesCount = Math.ceil(totalCount / pageSize);

    const items = await this.postModel
      .find({ blogId: blogId })
      .sort(sort)
      .skip(skip)
      .limit(pageSize);

    return postsToOutputModel(
      pagesCount,
      pageNumber,
      pageSize,
      totalCount,
      items,
      userId,
    );
  }
}

export const postsToOutputModel = (
  pagesCount: number,
  page: number,
  pageSize: number,
  totalCount: number,
  items: PostDocument[],
  userId: string,
): postsOutputModel => {
  return {
    pagesCount: pagesCount,
    page: page,
    pageSize: pageSize,
    totalCount: totalCount,
    items: items.map((item) => postToOutputModel(item, userId)),
  };
};

export const postToOutputModel = (
  post: PostDocument,
  userId: string,
): postToOutputModel => {
  return {
    id: post.id,
    title: post.title,
    shortDescription: post.shortDescription,
    content: post.content,
    blogId: post.blogId,
    blogName: post.blogName,
    createdAt: post.createdAt,
    extendedLikesInfo: {
      likesCount: post.extendedLikesInfo.likes.length,
      dislikesCount: post.extendedLikesInfo.dislikes.length,
      myStatus: post.extendedLikesInfo.likes.includes(userId)
        ? LikesModel.Like
        : post.extendedLikesInfo.dislikes.includes(userId)
        ? LikesModel.Dislike
        : LikesModel.None,
      newestLikes: post.extendedLikesInfo.newestLikes
        .sort((a, b) =>
          a.addedAt > b.addedAt ? -1 : b.addedAt > a.addedAt ? 1 : 0,
        )
        .map((likeInfo) => ({
          addedAt: likeInfo.addedAt,
          userId: likeInfo.userId,
          login: likeInfo.login,
        })),
    },
  };
};

export type postsOutputModel = {
  pagesCount: number;
  page: number;
  pageSize: number;
  totalCount: number;
  items: postToOutputModel[];
};

export type postToOutputModel = {
  id: string;
  title: string;
  shortDescription: string;
  content: string;
  blogId: string;
  blogName: string;
  createdAt: Date;
  extendedLikesInfo: {
    likesCount: number;
    dislikesCount: number;
    myStatus: string;
    newestLikes: {
      addedAt: Date;
      userId: string;
      login: string;
    }[];
  };
};
