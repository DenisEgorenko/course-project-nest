import { Injectable, NotFoundException } from '@nestjs/common';
import { CreatePostDto } from './dto/createPost.dto';
import { UpdatePostDto } from './dto/updatePost.dto';
import { Post, PostDocument, PostModel } from './schema/post.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Blog, BlogDocument, BlogModel } from '../blogs/schema/blogs.schema';
import { CreatePostBlogDto } from './dto/createPostBlog.dto';
import { postOutputModel, postToOutputModel } from './models/postsToViewModel';
import { DeleteResult } from 'mongodb';
import { SetLikeStatusDto } from './dto/setLikeStatusDto';
import { LikesModel } from '../../common/models/likesModel';

@Injectable()
export class PostsService {
  constructor(
    @InjectModel(Post.name)
    protected postModel: PostModel,
    @InjectModel(Blog.name)
    protected blogModel: BlogModel,
  ) {}

  // Post's CRUD

  async createPost(createPostDto: CreatePostDto): Promise<PostDocument> {
    const newPost = await this.postModel.createPost(
      createPostDto.title,
      createPostDto.shortDescription,
      createPostDto.content,
      createPostDto.blogId,
      this.postModel,
    );

    return await newPost.save();
  }

  async createBlogPost(
    createPostBlogDto: CreatePostBlogDto,
    blogId: string,
  ): Promise<PostDocument> {
    const newPost = await this.postModel.createPost(
      createPostBlogDto.title,
      createPostBlogDto.shortDescription,
      createPostBlogDto.content,
      blogId,
      this.postModel,
    );

    return await newPost.save();
  }

  async getPostById(id: string): Promise<PostDocument> {
    return this.postModel.findOne({ id });
  }

  async updatePost(id: string, updatePostDto: UpdatePostDto): Promise<void> {
    const posts: PostDocument[] = await this.postModel.find({ id });
    if (posts.length) {
      const post = posts[0];

      post.setTitle(updatePostDto.title);
      post.setShortDescription(updatePostDto.shortDescription);
      post.setContent(updatePostDto.content);
      post.setBlogId(updatePostDto.blogId);

      await post.save();
    } else {
      throw new NotFoundException('no such post');
    }
  }

  async deletePost(id: string): Promise<DeleteResult> {
    return this.postModel.deleteOne({ id });
  }

  // Post's likes

  async getUserLikeInfo(userId: string, postId: string) {
    const likesInfo = await this.postModel
      .find({ id: postId, 'extendedLikesInfo.likes': userId })
      .lean();

    if (likesInfo.length) {
      return LikesModel.Like;
    }

    const dislikeInfo = await this.postModel
      .find({ id: postId, 'extendedLikesInfo.dislikes': userId })
      .lean();

    if (dislikeInfo.length) {
      return LikesModel.Dislike;
    }

    return LikesModel.None;
  }

  async setLikeStatusToLike(postId: string, userId: string, userLogin: string) {
    const setLike = await this.postModel.updateMany(
      { id: postId },

      { $push: { 'extendedLikesInfo.likes': `${userId}` } },
      // {$pull: {'likesInfo.dislikes': `${userId}`}}
    );

    const unsetDislike = await this.postModel.updateOne(
      { id: postId },
      { $pull: { 'extendedLikesInfo.dislikes': `${userId}` } },
    );

    const addLastLike = await this.postModel.updateOne(
      { id: postId },
      {
        $push: {
          'extendedLikesInfo.newestLikes': {
            addedAt: new Date(),
            userId: userId,
            login: userLogin,
          },
        },
      },
    );

    const postInfo = await this.getPostById(postId);

    if (postInfo && postInfo.extendedLikesInfo.newestLikes.length > 3) {
      await this.postModel.updateOne(
        { id: postId },
        { $pop: { 'extendedLikesInfo.newestLikes': -1 } },
      );
    }

    return (
      (setLike.modifiedCount >= 1 && addLastLike.modifiedCount >= 1) ||
      unsetDislike.modifiedCount >= 1
    );
  }

  async setLikeStatusToDislike(postId: string, userId: string) {
    const setDislike = await this.postModel.updateOne(
      { id: postId },
      { $push: { 'extendedLikesInfo.dislikes': `${userId}` } },
    );

    const unsetLike = await this.postModel.updateOne(
      { id: postId },

      { $pull: { 'extendedLikesInfo.likes': `${userId}` } },
      // {$pull: {'likesInfo.dislikes': `${userId}`}}
    );

    const deleteLastLike = await this.postModel.updateOne(
      { id: postId },
      { $pull: { 'extendedLikesInfo.newestLikes': { userId: `${userId}` } } },
    );

    return (
      (setDislike.modifiedCount >= 1 && deleteLastLike.modifiedCount >= 1) ||
      unsetLike.modifiedCount >= 1
    );
  }

  async setLikeStatusToNone(postId: string, userId: string) {
    const unsetDislike = await this.postModel.updateOne(
      { id: postId },
      { $pull: { 'extendedLikesInfo.dislikes': `${userId}` } },
    );

    const unsetLike = await this.postModel.updateOne(
      { id: postId },
      { $pull: { 'extendedLikesInfo.likes': `${userId}` } },
    );

    const deleteLastLike = await this.postModel.updateOne(
      { id: postId },
      { $pull: { 'extendedLikesInfo.newestLikes': { userId: `${userId}` } } },
    );

    return (
      (unsetDislike.modifiedCount >= 1 && deleteLastLike.modifiedCount >= 1) ||
      unsetLike.modifiedCount >= 1
    );
  }

  async setPostLikeStatus(
    postId: string,
    userId: string,
    userLogin: string,
    setLikeStatusDto: SetLikeStatusDto,
  ) {
    const likeInfo = await this.getUserLikeInfo(userId, postId);

    if (
      likeInfo !== LikesModel.Like &&
      setLikeStatusDto.likeStatus === LikesModel.Like
    ) {
      await this.setLikeStatusToLike(postId, userId, userLogin);
    }

    if (
      likeInfo !== LikesModel.Dislike &&
      setLikeStatusDto.likeStatus === LikesModel.Dislike
    ) {
      await this.setLikeStatusToDislike(postId, userId);
    }

    if (setLikeStatusDto.likeStatus === LikesModel.None) {
      await this.setLikeStatusToNone(postId, userId);
    }
  }
}
