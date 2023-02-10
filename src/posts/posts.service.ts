import { Injectable, NotFoundException } from '@nestjs/common';
import { CreatePostDto } from './dto/createPost.dto';
import { UpdatePostDto } from './dto/updatePost.dto';
import { Model } from 'mongoose';
import { Post, PostDocument, PostStatics } from './schema/post.schema';
import { InjectModel } from '@nestjs/mongoose';
import { of } from 'rxjs';
import { postToOutputModel } from './postsQuery.repository';
import {
  Blog,
  BlogDocument,
  BlogStatics,
} from '../features/blogs/schema/blogs.schema';
import { CreatePostBlogDto } from './dto/createPostBlog.dto';

@Injectable()
export class PostsService {
  constructor(
    @InjectModel(Post.name)
    protected postModel: Model<PostDocument> & PostStatics,

    @InjectModel(Blog.name)
    protected blogModel: Model<BlogDocument> & BlogStatics,
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
    const blogs: BlogDocument[] = await this.blogModel.find({ id: blogId });

    if (!blogs.length) {
      throw new NotFoundException('no such blog');
    }

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
    } else {
      throw new NotFoundException('no such post');
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
    } else {
      throw new NotFoundException('no such post');
    }
  }

  async deletePost(id: string) {
    const post = await this.postModel.find({ id });
    if (!post.length) {
      throw new NotFoundException('no such post');
    }
    const deletedPost = await this.postModel.deleteOne({ id });
    return deletedPost;
  }
}
