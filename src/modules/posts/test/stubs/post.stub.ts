import { postOutputModel } from '../../models/postsToViewModel';

export const postStub = (): postOutputModel => {
  return {
    id: 'string',
    title: 'string',
    shortDescription: 'string',
    content: 'string',
    blogId: 'string',
    blogName: 'string',
    createdAt: new Date(0),
    extendedLikesInfo: {
      likesCount: 3,
      dislikesCount: 3,
      myStatus: 'string',
      newestLikes: [
        {
          addedAt: new Date(0),
          userId: 'string',
          login: 'string',
        },
      ],
    },
  };
};
