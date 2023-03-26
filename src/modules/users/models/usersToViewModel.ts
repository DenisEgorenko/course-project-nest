import { UserDocument } from '../../../db/schemas/user.schema';
import { usersQueryModel } from './usersQueryModel';
import { logging } from 'googleapis/build/src/apis/logging';

export const usersToOutputModel = (
  query: usersQueryModel,
  items: UserDocument[],
  totalCount: number,
): usersOutputModel => {
  const pageSize: number = query.pageSize ? +query.pageSize : 10;
  const pageNumber: number = query.pageNumber ? +query.pageNumber : 1;
  const pagesCount = Math.ceil(totalCount / pageSize);

  return {
    pagesCount: pagesCount,
    page: pageNumber,
    pageSize: pageSize,
    totalCount: totalCount,
    items: items.map((user) => userToOutputModel(user)),
  };
};

export const userToOutputModel = (user: UserDocument): userOutputModel => {
  return {
    id: user.accountData.id,
    login: user.accountData.login,
    email: user.accountData.email,
    createdAt: user.accountData.createdAt,
    banInfo: {
      isBanned: user.accountData.banStatus,
      banDate: user.accountData.banDate,
      banReason: user.accountData.banReason,
    },
  };
};

export const addUserToOutputModel = (
  user: UserDocument,
): addUserOutputModel => {
  return {
    login: user.accountData.login,
    email: user.accountData.email,
    createdAt: user.accountData.createdAt,
  };
};

export type userOutputModel = {
  id: string;
  login: string;
  email: string;
  createdAt: Date;
  banInfo: {
    isBanned: boolean;
    banDate: Date;
    banReason: string;
  };
};

export type addUserOutputModel = {
  login: string;
  email: string;
  createdAt: Date;
};

export type usersOutputModel = {
  pagesCount: number;
  page: number;
  pageSize: number;
  totalCount: number;
  items: userOutputModel[];
};

export const bannedUsersToOutputModel = (
  query: usersQueryModel,
  items: UserDocument[],
  totalCount: number,
  blogId: string,
) => {
  const pageSize: number = query.pageSize ? +query.pageSize : 10;
  const pageNumber: number = query.pageNumber ? +query.pageNumber : 1;
  const pagesCount = Math.ceil(totalCount / pageSize);

  // const filtered = items.filter(
  //   (user) =>
  //     user.blogsBanInfo.filter((ban) => ban.blogId === blogId).length > 0,
  // );

  return {
    pagesCount: pagesCount,
    page: pageNumber,
    pageSize: pageSize,
    totalCount: totalCount,
    items: items.map((user) => bannedUserToOutputModel(user, blogId)),
  };
};

export const bannedUserToOutputModel = (user: UserDocument, blogId: string) => {
  return {
    id: user.accountData.id,
    login: user.accountData.login,
    banInfo: {
      isBanned: true,
      banDate: user.blogsBanInfo.find((ban) => ban.blogId === blogId).banDate,
      banReason: user.blogsBanInfo.find((ban) => ban.blogId === blogId)
        .banReason,
    },
  };
};
