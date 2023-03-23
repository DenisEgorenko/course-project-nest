import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Post, PostDocument, PostModel } from '../../db/schemas/post.schema';
import {
  Comment,
  CommentDocument,
  CommentModel,
} from '../../db/schemas/comments.schema';
import { commentToOutputModel } from './commentsQuery.repository';
import { CreateCommentDto } from './dto/createComment.dto';
import { SetLikeStatusDto } from '../posts/dto/setLikeStatusDto';
import { LikesModel } from '../../common/models/likesModel';

@Injectable()
export class CommentsService {
  constructor(
    @InjectModel(Comment.name)
    protected commentModel: CommentModel,

    @InjectModel(Post.name)
    protected postModel: PostModel,
  ) {}

  async getCommentById(commentId: string) {
    return this.commentModel.findOne({
      id: commentId,
    });
  }

  async createPostComment(
    createCommentDto: CreateCommentDto,
    postId: string,
    userId: string,
    userLogin: string,
  ): Promise<CommentDocument> {
    const newComment = await this.commentModel.createComment(
      createCommentDto,
      userId,
      userLogin,
      postId,
      this.commentModel,
    );

    return await newComment.save();
  }

  async deleteCommentById(commentId: string): Promise<any> {
    return this.commentModel.deleteOne({ id: commentId });
  }

  async updateComment(commentId: string, content: string): Promise<any> {
    return this.commentModel.updateOne(
      { id: commentId },
      {
        $set: {
          content: content,
        },
      },
    );
  }

  async getUserLikeInfo(userId: string, commentId: string) {
    const likesInfo = await this.commentModel
      .find({ id: commentId, 'likesInfo.likes': userId })
      .lean();

    if (likesInfo.length) {
      return LikesModel.Like;
    }

    const dislikeInfo = await this.postModel
      .find({ id: commentId, 'likesInfo.dislikes': userId })
      .lean();

    if (dislikeInfo.length) {
      return LikesModel.Dislike;
    }

    return LikesModel.None;
  }
  async setLikeStatusToLike(commentId: string, userId: string) {
    const setLike = await this.commentModel.updateOne(
      { id: commentId },

      { $push: { 'likesInfo.likes': `${userId}` } },
      // {$pull: {'likesInfo.dislikes': `${userId}`}}
    );

    const unsetDislike = await this.commentModel.updateOne(
      { id: commentId },
      { $pull: { 'likesInfo.dislikes': `${userId}` } },
    );

    return setLike.modifiedCount >= 1 || unsetDislike.modifiedCount >= 1;
  }

  async setLikeStatusToDislike(commentId: string, userId: string) {
    const setDislike = await this.commentModel.updateOne(
      { id: commentId },
      { $push: { 'likesInfo.dislikes': `${userId}` } },
    );

    const unsetLike = await this.commentModel.updateOne(
      { id: commentId },

      { $pull: { 'likesInfo.likes': `${userId}` } },
    );

    return setDislike.modifiedCount >= 1 || unsetLike.modifiedCount >= 1;
  }
  async removeLikeAndDislike(commentId: string, userId: string) {
    const unsetDislike = await this.commentModel.updateOne(
      { id: commentId },
      { $pull: { 'likesInfo.dislikes': `${userId}` } },
    );

    const unsetLike = await this.commentModel.updateOne(
      { id: commentId },
      { $pull: { 'likesInfo.likes': `${userId}` } },
    );

    return unsetDislike.modifiedCount >= 1 || unsetLike.modifiedCount >= 1;
  }

  async setCommentLikeStatus(
    commentId: string,
    userId: string,
    setLikeStatusDto: SetLikeStatusDto,
  ) {
    const likeInfo = await this.getUserLikeInfo(userId, commentId);

    if (
      likeInfo !== LikesModel.Like &&
      setLikeStatusDto.likeStatus === LikesModel.Like
    ) {
      await this.setLikeStatusToLike(commentId, userId);
    }

    if (
      likeInfo !== LikesModel.Dislike &&
      setLikeStatusDto.likeStatus === LikesModel.Dislike
    ) {
      await this.setLikeStatusToDislike(commentId, userId);
    }

    if (setLikeStatusDto.likeStatus === LikesModel.None) {
      await this.removeLikeAndDislike(commentId, userId);
    }
  }
}
