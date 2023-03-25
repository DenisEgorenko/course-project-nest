import { PostDocument } from '../../../db/schemas/post.schema';
import { LikesModel } from '../../../common/models/likesModel';
import { postsQueryModel } from './postsQueryModel';

export const postsToOutputModel = (
  query: postsQueryModel,
  items: PostDocument[],
  totalCount: number,
  userId: string,
  bannedUsers: string[],
): postsOutputModel => {
  const pageSize: number = query.pageSize ? +query.pageSize : 10;
  const pageNumber: number = query.pageNumber ? +query.pageNumber : 1;
  const pagesCount = Math.ceil(totalCount / pageSize);

  return {
    pagesCount: pagesCount,
    page: pageNumber,
    pageSize: pageSize,
    totalCount: totalCount,
    items: items.map((item) => postToOutputModel(item, userId, bannedUsers)),
  };
};

export const postToOutputModel = (
  post: PostDocument,
  userId: string,
  bannedUsers: string[],
): postOutputModel => {
  const likes = post.extendedLikesInfo.likes.filter(
    (like) => !bannedUsers.includes(like),
  );

  const dislikes = post.extendedLikesInfo.dislikes.filter(
    (dislike) => !bannedUsers.includes(dislike),
  );

  const newestLikes = post.extendedLikesInfo.newestLikes.filter(
    (like) => !bannedUsers.includes(like.userId),
  );

  return {
    id: post.id,
    title: post.title,
    shortDescription: post.shortDescription,
    content: post.content,
    blogId: post.blogId,
    blogName: post.blogName,
    createdAt: post.createdAt,
    extendedLikesInfo: {
      likesCount: likes.length,
      dislikesCount: dislikes.length,
      myStatus: post.extendedLikesInfo.likes.includes(userId)
        ? LikesModel.Like
        : post.extendedLikesInfo.dislikes.includes(userId)
        ? LikesModel.Dislike
        : LikesModel.None,
      newestLikes: newestLikes
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