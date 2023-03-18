import { UserDocument } from '../schema/user.schema';

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
