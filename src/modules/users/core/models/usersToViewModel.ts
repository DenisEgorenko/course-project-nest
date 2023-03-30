import { UserDocument } from '../../infrastructure/mongo/model/user.schema';
import { usersQueryModel } from './usersQueryModel';
import { logging } from 'googleapis/build/src/apis/logging';
import { UserBaseEntity } from '../entity/user.entity';

export const usersToOutputModel = (
  query: usersQueryModel,
  items: UserBaseEntity[],
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

export const userToOutputModel = (user: UserBaseEntity): userOutputModel => {
  return {
    id: user.id,
    login: user.login,
    email: user.email,
    createdAt: user.createdAt,
    banInfo: {
      isBanned: user.userBanInfo.banStatus,
      banDate: user.userBanInfo.banDate,
      banReason: user.userBanInfo.banReason,
    },
  };
};

export const addUserToOutputModel = (
  user: UserDocument,
): addUserOutputModel => {
  return {
    login: user.login,
    email: user.email,
    createdAt: user.createdAt,
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

// export const bannedUsersToOutputModel = (
//   query: usersQueryModel,
//   items: UserDocument[],
//   totalCount: number,
//   blogId: string,
// ) => {
//   const pageSize: number = query.pageSize ? +query.pageSize : 10;
//   const pageNumber: number = query.pageNumber ? +query.pageNumber : 1;
//   const pagesCount = Math.ceil(totalCount / pageSize);
//
//   // const filtered = items.filter(
//   //   (user) =>
//   //     user.blogsBanInfo.filter((ban) => ban.blogId === blogId).length > 0,
//   // );
//
//   return {
//     pagesCount: pagesCount,
//     page: pageNumber,
//     pageSize: pageSize,
//     totalCount: totalCount,
//     items: items.map((user) => bannedUserToOutputModel(user, blogId)),
//   };
// };

// export const bannedUserToOutputModel = (user: UserDocument, blogId: string) => {
//   return {
//     id: user.accountData.id,
//     login: user.accountData.login,
//     banInfo: {
//       isBanned: true,
//       banDate: user.blogsBanInfo.find((ban) => ban.blogId === blogId).banDate,
//       banReason: user.blogsBanInfo.find((ban) => ban.blogId === blogId)
//         .banReason,
//     },
//   };
// };
