import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  HttpCode,
  NotFoundException,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { UsersQueryRepository } from '../usersQuery.repository';
import { UsersService } from '../users.service';
import { BasicAuthGuard } from '../../auth/guards/basic-auth.guard';
import {
  bannedUsersToOutputModel,
  usersToOutputModel,
  userToOutputModel,
} from '../models/usersToViewModel';
import { usersQueryModel } from '../models/usersQueryModel';
import { CreateUserDto } from '../dto/createUser.dto';
import { CommandBus } from '@nestjs/cqrs';
import { BanUserCommand } from '../use-cases/banUser.useCase';
import { BanStatusDto } from '../dto/banStatus.dto';
import { CreateUserCommand } from '../use-cases/createUser.useCase';
import { bannedUsersQueryModel } from '../models/bannedUsersQueryModel';
import { BlogsService } from '../../blogs/blogs.service';
import { BanUserBlogStatusDto } from '../dto/banUserBlogStatus.dto';
import {
  BanUserForBlogCommand,
  BanUserForBlogHandler,
} from '../use-cases/banUserForBlog.useCase';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { GetCurrentATJwtContext } from '../../../shared/decorators/get-At-current-user.decorator';
import { JwtATPayload } from '../../auth/interfaces/jwtPayload.type';

@Controller('blogger/users')
// @UseGuards(AuthGuard)
export class UsersBloggerController {
  constructor(
    protected commandBus: CommandBus,
    protected usersService: UsersService,
    protected blogService: BlogsService,
    protected usersQueryRepository: UsersQueryRepository,
  ) {}

  @Get('/blog/:blogId')
  @UseGuards(JwtAuthGuard)
  async getAllBannedUsersForBlog(
    @Query() query: usersQueryModel,
    @Param('blogId') blogId: string,
  ) {
    const blog = await this.blogService.getBlogById(blogId);

    if (!blog) {
      throw new NotFoundException();
    }
    const items = await this.usersQueryRepository.getAllUsers(query);

    return bannedUsersToOutputModel(
      query,
      items.items,
      items.totalCount,
      blogId,
    );
  }

  @Put(':userId/ban')
  @UseGuards(JwtAuthGuard)
  @HttpCode(204)
  async banUserForBlog(
    @Body() banStatusDto: BanUserBlogStatusDto,
    @Param('userId') userId: string,
    @GetCurrentATJwtContext() jwtATPayload: JwtATPayload,
  ) {
    const user = await this.usersService.findUserByUserId(userId);

    if (!user) {
      throw new NotFoundException();
    }

    const blog = await this.blogService.getBlogById(banStatusDto.blogId);

    if (!blog) {
      throw new NotFoundException();
    }

    if (blog.userId !== jwtATPayload.user.userId) {
      throw new ForbiddenException();
    }

    return this.commandBus.execute(
      new BanUserForBlogCommand(user, banStatusDto),
    );
  }
}
