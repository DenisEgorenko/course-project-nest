import { Test } from '@nestjs/testing';
import { PostsController } from '../posts.controller';
import { PostsService } from '../posts.service';
import { PostsQueryRepository } from '../postsQuery.repository';
import { CommentsQueryRepository } from '../../comments/commentsQuery.repository';
import { postStub } from './stubs/post.stub';
import { DataBaseModule } from '../../../db/db.module';
import { Post, PostDocument } from '../../../db/schemas/post.schema';
import { postOutputModel, postToOutputModel } from '../models/postsToViewModel';
import { CreatePostDto } from '../../blogs/controllers/dto/createPost.dto';
import { UpdatePostDto } from '../../blogs/controllers/dto/updatePost.dto';

jest.mock('../posts.service');
describe('PostsController', () => {
  let postsController: PostsController;
  let postsService: PostsService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [DataBaseModule],
      controllers: [PostsController],
      providers: [PostsService, PostsQueryRepository, CommentsQueryRepository],
    }).compile();

    postsController = moduleRef.get<PostsController>(PostsController);
    postsService = moduleRef.get<PostsService>(PostsService);

    jest.clearAllMocks();
  });

  describe('createPost', () => {
    describe('when createPost is called', () => {
      let createdPost: postOutputModel;
      const createPostDto: CreatePostDto = {
        title: 'string',
        shortDescription: 'string',
        content: 'string',
        blogId: 'string',
      };
      beforeEach(async () => {
        createdPost = await postsController.createPost(createPostDto);
      });

      test('it should call user service', () => {
        expect(postsService.createPost).toBeCalledWith(createPostDto, '');
      });

      test('it should return a post', () => {
        expect(createdPost).toEqual(postStub());
      });
    });
  });

  describe('getPostById', () => {
    describe('when getPostById is called', () => {
      let post: postOutputModel;
      beforeEach(async () => {
        post = await postsController.getPostById(postStub().id);
      });

      test('it should call post service', () => {
        expect(postsService.getPostById).toBeCalledWith(postStub().id, '');
      });

      test('it should return a post', () => {
        expect(post).toEqual(postStub());
      });
    });
  });

  describe('updatePost', () => {
    describe('when updatePost is called', () => {
      const updatePostDto: UpdatePostDto = {
        title: 'string',
        shortDescription: 'string',
        content: 'string',
        blogId: 'string',
      };
      beforeEach(async () => {
        await postsController.updatePost(postStub().id, updatePostDto);
      });

      test('it should call post service', () => {
        expect(postsService.updatePost).toBeCalledWith(
          postStub().id,
          updatePostDto,
        );
      });
    });
  });

  describe('deletePost', () => {
    describe('when deletePost is called', () => {
      beforeEach(async () => {
        await postsController.deletePost(postStub().id);
      });

      test('it should call post service', () => {
        expect(postsService.deletePost).toBeCalledWith(postStub().id);
      });
    });
  });
});
