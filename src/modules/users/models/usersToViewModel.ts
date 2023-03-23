import { UserDocument } from '../../../db/schemas/user.schema';

export const usersToOutputModel = (
  pagesCount: number,
  page: number,
  pageSize: number,
  totalCount: number,
  items: UserDocument[],
): usersOutputModel => {
  return {
    pagesCount: pagesCount,
    page: page,
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
