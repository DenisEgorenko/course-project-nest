import { Injectable } from '@nestjs/common';
import { DeleteResult } from 'mongodb';
import { SetLikeStatusDto } from './dto/setLikeStatusDto';
import { IPostsRepository } from './core/abstracts/posts.repository.abstract';
import { IPostsQueryRepository } from './core/abstracts/postsQuery.repository.abstract';
import { PostsQueryModel } from './models/postsQueryModel';

@Injectable()
export class PostsService {
  constructor(
    protected postsRepository: IPostsRepository,
    protected postsQueryRepository: IPostsQueryRepository,
  ) {}

  async getPostById(id: string) {
    return this.postsRepository.getPostById(id);
  }

  async getAllPosts(query: PostsQueryModel, blogId?: string) {
    return this.postsQueryRepository.getAllPosts(query, blogId);
  }

  async getAllPostsWithBlogId(query: PostsQueryModel, blogId: string) {
    return this.postsQueryRepository.getAllPostsWithBlogId(query, blogId);
  }

  async deletePost(id: string): Promise<DeleteResult> {
    return this.postsRepository.deletePostById(id);
  }

  // Post's likes

  async getUserLikeInfo(userId: string, postId: string) {
    // const likesInfo = await this.postModel
    //   .find({ id: postId, 'extendedLikesInfo.likes': userId })
    //   .lean();
    //
    // if (likesInfo.length) {
    //   return LikesModel.Like;
    // }
    //
    // const dislikeInfo = await this.postModel
    //   .find({ id: postId, 'extendedLikesInfo.dislikes': userId })
    //   .lean();
    //
    // if (dislikeInfo.length) {
    //   return LikesModel.Dislike;
    // }
    //
    // return LikesModel.None;

    return;
  }

  async setLikeStatusToLike(postId: string, userId: string, userLogin: string) {
    // const setLike = await this.postModel.updateMany(
    //   { id: postId },
    //
    //   { $push: { 'extendedLikesInfo.likes': `${userId}` } },
    //   // {$pull: {'likesInfo.dislikes': `${userId}`}}
    // );
    //
    // const unsetDislike = await this.postModel.updateOne(
    //   { id: postId },
    //   { $pull: { 'extendedLikesInfo.dislikes': `${userId}` } },
    // );
    //
    // const addLastLike = await this.postModel.updateOne(
    //   { id: postId },
    //   {
    //     $push: {
    //       'extendedLikesInfo.newestLikes': {
    //         addedAt: new Date(),
    //         userId: userId,
    //         login: userLogin,
    //       },
    //     },
    //   },
    // );
    //
    // const postInfo = await this.getPostById(postId);
    //
    // if (postInfo && postInfo.extendedLikesInfo.newestLikes.length > 3) {
    //   await this.postModel.updateOne(
    //     { id: postId },
    //     { $pop: { 'extendedLikesInfo.newestLikes': -1 } },
    //   );
    // }
    //
    // return (
    //   (setLike.modifiedCount >= 1 && addLastLike.modifiedCount >= 1) ||
    //   unsetDislike.modifiedCount >= 1
    // );
    return;
  }

  async setLikeStatusToDislike(postId: string, userId: string) {
    // const setDislike = await this.postModel.updateOne(
    //   { id: postId },
    //   { $push: { 'extendedLikesInfo.dislikes': `${userId}` } },
    // );
    //
    // const unsetLike = await this.postModel.updateOne(
    //   { id: postId },
    //
    //   { $pull: { 'extendedLikesInfo.likes': `${userId}` } },
    //   // {$pull: {'likesInfo.dislikes': `${userId}`}}
    // );
    //
    // const deleteLastLike = await this.postModel.updateOne(
    //   { id: postId },
    //   { $pull: { 'extendedLikesInfo.newestLikes': { userId: `${userId}` } } },
    // );
    //
    // return (
    //   (setDislike.modifiedCount >= 1 && deleteLastLike.modifiedCount >= 1) ||
    //   unsetLike.modifiedCount >= 1
    // );

    return;
  }

  async setLikeStatusToNone(postId: string, userId: string) {
    // const unsetDislike = await this.postModel.updateOne(
    //   { id: postId },
    //   { $pull: { 'extendedLikesInfo.dislikes': `${userId}` } },
    // );
    //
    // const unsetLike = await this.postModel.updateOne(
    //   { id: postId },
    //   { $pull: { 'extendedLikesInfo.likes': `${userId}` } },
    // );
    //
    // const deleteLastLike = await this.postModel.updateOne(
    //   { id: postId },
    //   { $pull: { 'extendedLikesInfo.newestLikes': { userId: `${userId}` } } },
    // );
    //
    // return (
    //   (unsetDislike.modifiedCount >= 1 && deleteLastLike.modifiedCount >= 1) ||
    //   unsetLike.modifiedCount >= 1
    // );

    return;
  }

  async setPostLikeStatus(
    postId: string,
    userId: string,
    setLikeStatusDto: SetLikeStatusDto,
  ) {
    // const likeInfo = await this.getUserLikeInfo(userId, postId);
    //
    // if (
    //   likeInfo !== LikesModel.Like &&
    //   setLikeStatusDto.likeStatus === LikesModel.Like
    // ) {
    //   await this.setLikeStatusToLike(postId, userId, userLogin);
    // }
    //
    // if (
    //   likeInfo !== LikesModel.Dislike &&
    //   setLikeStatusDto.likeStatus === LikesModel.Dislike
    // ) {
    //   await this.setLikeStatusToDislike(postId, userId);
    // }
    //
    // if (setLikeStatusDto.likeStatus === LikesModel.None) {
    //   await this.setLikeStatusToNone(postId, userId);
    // }

    return;
  }
}
