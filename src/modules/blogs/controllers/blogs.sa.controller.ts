import {
  Body,
  Controller,
  Get,
  HttpCode,
  NotFoundException,
  Param,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { BasicAuthGuard } from '../../auth/guards/basic-auth.guard';
import {
  blogsToOutputModel,
  blogsToOutputModelForSA,
} from '../models/blogsToViewModel';
import { blogsQueryModel } from '../models/blogsQueryModel';
import { BlogsQueryRepository } from '../blogsQuery.repository';
import { BlogsService } from '../blogs.service';
import { CommandBus } from '@nestjs/cqrs';
import { BanStatusDto } from './dto/banStatus.dto';
import { BanBlogCommand } from '../use-cases/banBlog.useCase';
import { IBlogsQueryRepository } from '../core/abstracts/blogsQuery.repository.abstract';

@Controller('sa/blogs')
export class BlogsSaController {
  constructor(
    protected blogsQueryRepository: IBlogsQueryRepository,
    protected blogService: BlogsService,
    protected commandBus: CommandBus,
  ) {}

  // Bind Blog with user
  @Put(':blogId/bind-with-user/:userId')
  @UseGuards(BasicAuthGuard)
  @HttpCode(204)
  async updateBlog(
    @Param('blogId') blogId: string,
    @Param('userId') userId: string,
  ) {
    return null;
  }

  // Return all User's blogs
  @Get()
  @UseGuards(BasicAuthGuard)
  async getAllBlogs(@Query() query: blogsQueryModel) {
    const result = await this.blogsQueryRepository.getAllBlogs(query, true);

    return blogsToOutputModelForSA(query, result.items, result.totalCount);
  }

  // Ban Blog

  @Put(':blogId/ban')
  @UseGuards(BasicAuthGuard)
  @HttpCode(204)
  async banBlog(
    @Body() banStatusDto: BanStatusDto,
    @Param('blogId') blogId: string,
  ) {
    const blog = await this.blogService.getBlogById(blogId);

    if (!blog) {
      throw new NotFoundException();
    }

    await this.commandBus.execute(new BanBlogCommand(blogId, banStatusDto));
  }
}
