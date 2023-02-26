import { Injectable, NotFoundException } from '@nestjs/common';
import { CreatePostDto } from './dto/createPost.dto';
import { UpdatePostDto } from './dto/updatePost.dto';
import { Post, PostDocument, PostModel } from './schema/post.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Blog, BlogDocument, BlogModel } from '../blogs/schema/blogs.schema';
import { CreatePostBlogDto } from './dto/createPostBlog.dto';
import { postOutputModel, postToOutputModel } from './models/postsToViewModel';
import { DeleteResult } from 'mongodb';

@Injectable()
export class PostsService {
  constructor(
    @InjectModel(Post.name)
    protected postModel: PostModel,

    @InjectModel(Blog.name)
    protected blogModel: BlogModel,
  ) {}
  async createPost(
    createPostDto: CreatePostDto,
    userId: string,
  ): Promise<postOutputModel> {
    const newPost = await this.postModel.createPost(
      createPostDto.title,
      createPostDto.shortDescription,
      createPostDto.content,
      createPostDto.blogId,
      this.postModel,
    );

    const createdPost = await newPost.save();

    return postToOutputModel(createdPost, userId);
  }

  async createPostBlog(
    createPostBlogDto: CreatePostBlogDto,
    blogId: string,
    userId: string,
  ): Promise<postOutputModel> {
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

    const createdPost = await newPost.save();

    return postToOutputModel(createdPost, userId);
  }

  async getPostById(id: string, userId: string): Promise<postOutputModel> {
    const posts: PostDocument[] = await this.postModel.find({ id });
    if (posts.length) {
      console.log(posts[0]);
      return postToOutputModel(posts[0], userId);
    } else {
      throw new NotFoundException('no such post');
    }
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
    const post = await this.postModel.find({ id });
    if (!post.length) {
      throw new NotFoundException('no such post');
    }
    return this.postModel.deleteOne({ id });
  }
}
