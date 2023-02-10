import { Injectable } from '@nestjs/common';
import { CreatePostDto } from './dto/createPost.dto';
import { UpdatePostDto } from './dto/updatePost.dto';
import { Model } from 'mongoose';
import { Post, PostDocument, PostStatics } from './schema/post.schema';
import { InjectModel } from '@nestjs/mongoose';
import { of } from 'rxjs';
import { postToOutputModel } from './postsQuery.repository';
import { BlogDocument } from '../features/blogs/schema/blogs.schema';
import { CreatePostBlogDto } from './dto/createPostBlog.dto';

@Injectable()
export class PostsService {
  constructor(
    @InjectModel(Post.name)
    protected postModel: Model<PostDocument> & PostStatics,
  ) {}
  async createPost(createPostDto: CreatePostDto, userId: string) {
    const newPost = await this.postModel.createPost(
      createPostDto.title,
      createPostDto.shortDescription,
      createPostDto.content,
      createPostDto.blogId,
      this.postModel,
    );

    await newPost.save();

    return postToOutputModel(newPost, userId);
  }

  async createPostBlog(
    createPostBlogDto: CreatePostBlogDto,
    blogId: string,
    userId: string,
  ) {
    const newPost = await this.postModel.createPost(
      createPostBlogDto.title,
      createPostBlogDto.shortDescription,
      createPostBlogDto.content,
      blogId,
      this.postModel,
    );

    await newPost.save();

    return postToOutputModel(newPost, userId);
  }

  async findPostById(id: string, userId: string) {
    const posts: PostDocument[] = await this.postModel.find({ id });
    if (posts.length) {
      return postToOutputModel(posts[0], userId);
    }
  }

  async updatePost(id: string, updatePostDto: UpdatePostDto) {
    const posts: PostDocument[] = await this.postModel.find({ id });
    if (posts.length) {
      const post = posts[0];
      post.title = updatePostDto.title;
      post.shortDescription = updatePostDto.shortDescription;
      post.content = updatePostDto.content;
      post.blogId = updatePostDto.blogId;

      await post.save();
    }
  }

  async deletePost(id: string) {
    const deletedPost = await this.postModel.deleteOne({ id });
    return deletedPost;
  }
}
