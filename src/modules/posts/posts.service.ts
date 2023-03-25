import { Injectable } from '@nestjs/common';
import { Post, PostDocument, PostModel } from '../../db/schemas/post.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Blog, BlogModel } from '../../db/schemas/blogs.schema';
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

  async getPostById(id: string): Promise<PostDocument> {
    return this.postModel.findOne({ id });
  }

  async deletePost(id: string): Promise<DeleteResult> {
    return this.postModel.deleteOne({ id });
  }

  async getAllBloggerPosts(userId: string) {
    const posts = await this.postModel.find({ userId });
    return posts.map((post) => post.id);
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
