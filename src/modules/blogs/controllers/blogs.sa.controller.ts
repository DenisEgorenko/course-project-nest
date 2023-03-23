import {
  Controller,
  Get,
  HttpCode,
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

@Controller('sa/blogs')
export class BlogsSaController {
  constructor(protected blogsQueryRepository: BlogsQueryRepository) {}

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
    const result = await this.blogsQueryRepository.getAllBlogs(query);

    return blogsToOutputModelForSA(query, result.items, result.totalCount);
  }
}
