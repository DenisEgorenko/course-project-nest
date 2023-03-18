import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/createUser.dto';
import { usersQueryModel } from './models/usersQueryModel';
import { UsersQueryRepository } from './usersQuery.repository';
import { AuthGuard } from '../../auth.guard';
import {
  addUserToOutputModel,
  userToOutputModel,
} from './models/usersToViewModel';
import { BasicAuthGuard } from '../auth/guards/basic-auth.guard';

@Controller('users')
// @UseGuards(AuthGuard)
export class UsersController {
  constructor(
    protected usersService: UsersService,
    protected usersQueryRepository: UsersQueryRepository,
  ) {}

  @Get()
  @UseGuards(BasicAuthGuard)
  async getAllUsers(@Query() query: usersQueryModel) {
    return await this.usersQueryRepository.getAllUsers(query);
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
    const newUser = await this.usersService.createUser(createUserDto);
    return addUserToOutputModel(newUser);
  }

  @Delete(':id')
  @UseGuards(BasicAuthGuard)
  @HttpCode(204)
  async delete(@Param('id') id: string) {
    return this.usersService.deleteUser(id);
  }
}
