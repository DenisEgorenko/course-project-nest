import { PostDocument } from '../schema/post.schema';
import { LikesModel } from '../../../common/models/likesModel';

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
): postOutputModel => {
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
  items: postOutputModel[];
};

export type postOutputModel = {
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
