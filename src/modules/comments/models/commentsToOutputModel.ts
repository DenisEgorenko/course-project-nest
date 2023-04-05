import { LikesModel } from '../../../common/models/likesModel';
import { CommentsQueryModel } from './commentsQueryModel';

export const commentsToOutputModel = (
  query: CommentsQueryModel,
  items: any[],
  totalCount: number,
  userId: string,
): commentsOutputModel => {
  const pageSize: number = query.pageSize ? +query.pageSize : 10;
  const pageNumber: number = query.pageNumber ? +query.pageNumber : 1;
  const pagesCount = Math.ceil(totalCount / pageSize);

  return {
    pagesCount: pagesCount,
    page: pageNumber,
    pageSize: pageSize,
    totalCount: totalCount,
    items: items.map((comment) => commentToOutputModel(comment, userId)),
  };
};

export const commentToOutputModel = (
  item: any,
  userId: string,
): commentOutputModel => {
  let filteredCommentsLikes;
  if (item.commentsLikes) {
    filteredCommentsLikes = item.commentsLikes
      .filter((like) => like.user.userBanInfo.banStatus === false)
      .sort((a, b) => (a.createdAt > b.createdAt ? -1 : 1));
  } else {
    filteredCommentsLikes = [];
  }

  const userLike = filteredCommentsLikes.filter(
    (like) => like.user.id === userId,
  );

  return {
    id: item.id,
    content: item.content,
    commentatorInfo: {
      userId: item.user.id,
      userLogin: item.user.login,
    },
    createdAt: item.createdAt,
    likesInfo: {
      likesCount: filteredCommentsLikes.filter(
        (like) => like.likeStatus === LikesModel.Like,
      ).length,
      dislikesCount: filteredCommentsLikes.filter(
        (like) => like.likeStatus === LikesModel.Dislike,
      ).length,
      myStatus: userLike.length ? userLike[0].likeStatus : LikesModel.None,
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
