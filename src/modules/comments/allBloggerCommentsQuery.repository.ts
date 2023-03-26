import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { Sort } from 'mongodb';
import { InjectModel } from '@nestjs/mongoose';
import { Comment, CommentDocument } from '../../db/schemas/comments.schema';
import { commentsQueryModel } from './models/commentsQueryModel';
import { LikesModel } from 'src/common/models/likesModel';
import { BlogsCommentsQueryModel } from '../blogs/models/blogsCommentsQueryModel';
import { query } from 'express';
import { PostsService } from '../posts/posts.service';

@Injectable()
export class AllBloggerCommentsQueryRepository {
  constructor(
    @InjectModel(Comment.name)
    protected commentModel: Model<CommentDocument>,

    protected postService: PostsService,
  ) {}
  async getAllBloggerPostComments(
    query: commentsQueryModel,
    userId: string,
    posts: string[],
  ) {
    const sortBy = query.sortBy ? query.sortBy : 'createdAt';
    const sortDirection: Sort = query.sortDirection === 'asc' ? 1 : -1;
    const sort = { [sortBy]: sortDirection };

    const pageSize: number = query.pageSize ? +query.pageSize : 10;
    const pageNumber: number = query.pageNumber ? +query.pageNumber : 1;

    const skip: number = pageSize * (pageNumber - 1);

    const totalCount = await this.commentModel.countDocuments({
      postId: { $in: posts },
    });

    const items = await this.commentModel
      .find({ postId: { $in: posts } })
      .sort(sort)
      .skip(skip)
      .limit(pageSize);

    return { items, totalCount };
  }

  async allBloggerPostsCommentsToOutputModel(
    blogsCommentsQueryModel: BlogsCommentsQueryModel,
    items: CommentDocument[],
    totalCount: number,
    userId: string,
    bannedUsers: string[],
  ): Promise<commentsOutputModel> {
    const pageSize: number = blogsCommentsQueryModel.pageSize
      ? +blogsCommentsQueryModel.pageSize
      : 10;
    const pageNumber: number = blogsCommentsQueryModel.pageNumber
      ? +blogsCommentsQueryModel.pageNumber
      : 1;
    const pagesCount = Math.ceil(totalCount / pageSize);

    return {
      pagesCount: pagesCount,
      page: pageNumber,
      pageSize: pageSize,
      totalCount: totalCount,
      items: await Promise.all(
        items.map(
          async (comment) =>
            await this.commentToOutputModel(comment, userId, bannedUsers),
        ),
      ),
    };
  }

  async commentToOutputModel(
    item: CommentDocument,
    userId: string,
    bannedUsers: string[],
  ): Promise<commentOutputModel> {
    const postInfo = await this.postService.getPostById(item.postId);

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
      postInfo: {
        id: postInfo.id,
        blogId: postInfo.blogId,
        blogName: postInfo.blogName,
        title: postInfo.title,
      },
    };
  }
}

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
    myStatus: string;
  };
  postInfo: {
    id: string;
    title: string;
    blogId: string;
    blogName: string;
  };
};
