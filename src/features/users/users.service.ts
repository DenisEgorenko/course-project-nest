import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateUserDto } from './dto/createUser.dto';
import { PasswordService } from '../../application/password.service';
import { User, UserDocument, UserStatics } from './schema/user.schema';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name)
    protected userModel: Model<UserDocument> & UserStatics,
    protected passwordService: PasswordService,
  ) {}

  async createUser(createUserDto: CreateUserDto) {
    const passwordSalt = await this.passwordService.generateSalt();
    const passwordHash = await this.passwordService.generateHash(
      createUserDto.password,
      passwordSalt,
    );

    const newUser = await this.userModel.createUser(
      createUserDto.login,
      createUserDto.email,
      passwordHash,
      passwordSalt,
      this.userModel,
    );

    await newUser.save();

    return {
      id: newUser.accountData.id,
      login: newUser.accountData.login,
      email: newUser.accountData.email,
      createdAt: newUser.accountData.createdAt,
    };
  }

  async deleteUser(id: string) {
    const user = await this.userModel.find({ id });
    if (!user.length) {
      throw new NotFoundException('no such user');
    }
    const deletedUser = await this.userModel
      .deleteOne({ 'accountData.id': id })
      .exec();
    return deletedUser;
  }
}
