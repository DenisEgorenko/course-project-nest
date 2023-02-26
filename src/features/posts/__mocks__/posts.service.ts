import { postStub } from '../test/stubs/post.stub';
import { DeleteResult } from 'mongodb';

export const PostsService = jest.fn().mockReturnValue({
  createPost: jest.fn().mockResolvedValue(postStub()),
  createPostBlog: jest.fn().mockResolvedValue(postStub()),
  getPostById: jest.fn().mockResolvedValue(postStub()),
  updatePost: jest.fn().mockResolvedValue(Promise<void>),
  deletePost: jest.fn().mockResolvedValue(Promise<DeleteResult>),
});
