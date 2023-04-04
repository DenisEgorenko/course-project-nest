import { LikesModel } from '../../../common/models/likesModel';
import { PostsQueryModel } from './postsQueryModel';

export const postsToOutputModel = (
  query: PostsQueryModel,
  items: any[],
  totalCount: number,
  userId: string,
): postsOutputModel => {
  const pageSize: number = query.pageSize ? +query.pageSize : 10;
  const pageNumber: number = query.pageNumber ? +query.pageNumber : 1;
  const pagesCount = Math.ceil(totalCount / pageSize);

  return {
    pagesCount: pagesCount,
    page: pageNumber,
    pageSize: pageSize,
    totalCount: totalCount,
    items: items.map((item) => postToOutputModel(item, userId)),
  };
};

export const postToOutputModel = (
  post: any,
  userId: string,
): postOutputModel => {
  console.log('One post in second function', post);

  let filteredPostLikes;
  if (post.postLikes) {
    filteredPostLikes = post.postLikes.filter(
      (like) => like.user.userBanInfo.banStatus === false,
    );
  } else {
    filteredPostLikes = [];
  }

  const userLike = filteredPostLikes.filter((like) => like.user.id === userId);

  return {
    id: post.id,
    title: post.title,
    shortDescription: post.shortDescription,
    content: post.content,
    blogId: post.blog.id,
    blogName: post.blog.name,
    createdAt: post.createdAt,
    extendedLikesInfo: {
      likesCount: filteredPostLikes.filter(
        (like) => like.likeStatus === LikesModel.Like,
      ).length,
      dislikesCount: filteredPostLikes.filter(
        (like) => like.likeStatus === LikesModel.Dislike,
      ).length,
      myStatus: userLike.length ? userLike[0].likeStatus : LikesModel.None,
      newestLikes: filteredPostLikes
        .filter((like) => like.likeStatus === LikesModel.Like)
        .slice(0, 3)
        .map((likeInfo) => ({
          addedAt: likeInfo.createdAt,
          userId: likeInfo.user.id,
          login: likeInfo.user.login,
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
