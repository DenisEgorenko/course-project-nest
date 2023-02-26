import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { CreateUserDto } from './dto/createUser.dto';
import { PasswordService } from '../../application/password.service';
import { User, UserModel } from './schema/user.schema';
import { userToOutputModel } from './models/usersToViewModel';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name)
    protected userModel: UserModel,
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

    const createdUser = await newUser.save();

    return userToOutputModel(createdUser);
  }

  async deleteUser(id: string) {
    const user = await this.userModel.find({ 'accountData.id': id });
    console.log(user);
    if (!user.length) {
      throw new NotFoundException('no such user');
    }
    const deletedUser = await this.userModel
      .deleteOne({ 'accountData.id': id })
      .exec();
    return deletedUser;
  }
}
