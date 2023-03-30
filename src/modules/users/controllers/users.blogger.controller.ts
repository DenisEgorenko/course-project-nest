import {
  Body,
  Controller,
  ForbiddenException,
  Get,
  HttpCode,
  NotFoundException,
  Param,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from '../services/users.service';
import { usersQueryModel } from '../core/models/usersQueryModel';
import { CommandBus } from '@nestjs/cqrs';
import { BlogsService } from '../../blogs/blogs.service';
import { BanUserBlogStatusDto } from '../core/dto/banUserBlogStatus.dto';
import { BanUserForBlogCommand } from '../use-cases/banUserForBlog.useCase';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { GetCurrentATJwtContext } from '../../../shared/decorators/get-At-current-user.decorator';
import { JwtATPayload } from '../../auth/interfaces/jwtPayload.type';

@Controller('blogger/users')
// @UseGuards(AuthGuard)
export class UsersBloggerController {
  constructor(
    protected commandBus: CommandBus,
    protected usersService: UsersService,
    protected blogService: BlogsService, // protected usersQueryRepository: UsersQueryRepository,
  ) {}

  // @Get('/blog/:blogId')
  // @UseGuards(JwtAuthGuard)
  // async getAllBannedUsersForBlog(
  //   @Query() query: usersQueryModel,
  //   @Param('blogId') blogId: string,
  //   @GetCurrentATJwtContext() jwtATPayload: JwtATPayload,
  // ) {
  //   const blog = await this.blogService.getBlogById(blogId);
  //
  //   if (!blog) {
  //     throw new NotFoundException();
  //   }
  //
  //   if (blog.userId !== jwtATPayload.user.userId) {
  //     throw new ForbiddenException();
  //   }
  //
  //   const items = await this.usersQueryRepository.getAllUsers(query, blogId);
  //
  //   return bannedUsersToOutputModel(
  //     query,
  //     items.items,
  //     items.totalCount,
  //     blogId,
  //   );
  // }
  //
  // @Put(':userId/ban')
  // @UseGuards(JwtAuthGuard)
  // @HttpCode(204)
  // async banUserForBlog(
  //   @Body() banStatusDto: BanUserBlogStatusDto,
  //   @Param('userId') userId: string,
  //   @GetCurrentATJwtContext() jwtATPayload: JwtATPayload,
  // ) {
  //   const user = await this.commandBus.execute(new FindUserByIdCommand(userId));
  //
  //   if (!user) {
  //     throw new NotFoundException();
  //   }
  //
  //   const blog = await this.blogService.getBlogById(banStatusDto.blogId);
  //
  //   if (!blog) {
  //     throw new NotFoundException();
  //   }
  //
  //   if (blog.userId !== jwtATPayload.user.userId) {
  //     throw new ForbiddenException();
  //   }
  //
  //   return this.commandBus.execute(
  //     new BanUserForBlogCommand(user, banStatusDto),
  //   );
  // }
}
