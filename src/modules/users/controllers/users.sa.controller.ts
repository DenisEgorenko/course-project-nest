import {
  BadRequestException,
  Body,
  Controller,
  Delete,
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
  usersToOutputModel,
  userToOutputModel,
} from '../models/usersToViewModel';
import { usersQueryModel } from '../models/usersQueryModel';
import { CreateUserDto } from '../dto/createUser.dto';
import { CommandBus } from '@nestjs/cqrs';
import { BanUserCommand } from '../use-cases/banUser.useCase';
import { BanStatusDto } from '../dto/banStatus.dto';
import { CreateUserCommand } from '../use-cases/createUser.useCase';

@Controller('sa/users')
// @UseGuards(AuthGuard)
export class UsersSaController {
  constructor(
    protected commandBus: CommandBus,
    protected usersService: UsersService,
    protected usersQueryRepository: UsersQueryRepository,
  ) {}

  @Get()
  @UseGuards(BasicAuthGuard)
  async getAllUsers(@Query() query: usersQueryModel) {
    const items = await this.usersQueryRepository.getAllUsers(query);

    return usersToOutputModel(query, items.items, items.totalCount);
  }

  @Post()
  @UseGuards(BasicAuthGuard)
  async createUser(@Body() createUserDto: CreateUserDto) {
    const userEmail = await this.usersService.findUserByLoginOrEmail(
      createUserDto.email,
    );
    const userLogin = await this.usersService.findUserByLoginOrEmail(
      createUserDto.login,
    );
    if (userLogin || userEmail) {
      throw new BadRequestException([
        {
          message: 'User with such login or email already exist',
          field: 'login',
        },
      ]);
    }

    const newUser = await this.commandBus.execute(
      new CreateUserCommand(createUserDto),
    );

    return userToOutputModel(newUser);
  }

  @Delete(':id')
  @UseGuards(BasicAuthGuard)
  @HttpCode(204)
  async delete(@Param('id') id: string) {
    return this.usersService.deleteUser(id);
  }

  @Put(':userId/ban')
  @UseGuards(BasicAuthGuard)
  @HttpCode(204)
  async banUser(
    @Body() banStatusDto: BanStatusDto,
    @Param('userId') userId: string,
  ) {
    const user = await this.usersService.findUserByUserId(userId);

    if (!user) {
      throw new NotFoundException();
    }

    return this.commandBus.execute(new BanUserCommand(user, banStatusDto));
  }
}
