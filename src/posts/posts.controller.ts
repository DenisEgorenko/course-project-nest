import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  Put,
  HttpCode,
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/createPost.dto';
import { UpdatePostDto } from './dto/updatePost.dto';
import { PostsQueryRepository } from './postsQuery.repository';
import { postsQueryModel } from './models/postsQueryModel';
import { commentsQueryModel } from '../features/comments/models/commentsQueryModel';
import { CommentsQueryRepository } from '../features/comments/commentsQuery.repository';

@Controller('posts')
export class PostsController {
  constructor(
    protected postsService: PostsService,
    protected postsQueryRepository: PostsQueryRepository,
    protected commentsQueryRepository: CommentsQueryRepository,
  ) {}

  @Post()
  createPost(@Body() createPostDto: CreatePostDto) {
    return this.postsService.createPost(createPostDto, '');
  }

  @Get()
  getAllPosts(@Query() query: postsQueryModel) {
    return this.postsQueryRepository.getAllPosts(query, '');
  }

  @Get(':id/comments')
  getPostComments(@Param('id') id: string, @Query() query: commentsQueryModel) {
    return this.commentsQueryRepository.getAllPostComments(id, query, '');
  }

  @Get(':id')
  findPostById(@Param('id') id: string) {
    return this.postsService.findPostById(id, '');
  }

  @Put(':id')
  @HttpCode(204)
  updatePost(@Param('id') id: string, @Body() updatePostDto: UpdatePostDto) {
    return this.postsService.updatePost(id, updatePostDto);
  }

  @Delete(':id')
  @HttpCode(204)
  deletePost(@Param('id') id: string) {
    return this.postsService.deletePost(id);
  }
}
