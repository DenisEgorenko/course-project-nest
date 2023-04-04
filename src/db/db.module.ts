import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  Blog,
  BlogSchema,
} from '../modules/blogs/infrastructure/mongo/model/blogs.schema';
import {
  Post,
  PostSchema,
} from '../modules/posts/infrastructure/mongo/model/post.schema';
import {
  Comment,
  CommentSchema,
} from '../modules/comments/infrastructure/mongo/model/comments.schema';
import { ConfigService } from '@nestjs/config';
import {
  Security,
  SecuritySchema,
} from '../modules/security/infrastructure/mongo/model/security.schema';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    MongooseModule.forRootAsync({
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('database.mongo.mongo_uri'),
      }),
    }),

    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('database.postgre.host'),
        port: configService.get<number>('database.postgre.db_port'),
        username: configService.get<string>('database.postgre.user'),
        password: configService.get<string>('database.postgre.password'),
        database: configService.get<string>('database.postgre.database'),
        autoLoadEntities: true,
        synchronize: true,
        ssl: configService.get<boolean>('database.postgre.ssl'),
      }),
    }),

    MongooseModule.forFeature([{ name: Blog.name, schema: BlogSchema }]),
    MongooseModule.forFeature([{ name: Post.name, schema: PostSchema }]),
    MongooseModule.forFeature([{ name: Comment.name, schema: CommentSchema }]),
    MongooseModule.forFeature([
      { name: Security.name, schema: SecuritySchema },
    ]),
  ],
  exports: [
    MongooseModule.forFeature([{ name: Blog.name, schema: BlogSchema }]),
    MongooseModule.forFeature([{ name: Post.name, schema: PostSchema }]),
    MongooseModule.forFeature([{ name: Comment.name, schema: CommentSchema }]),
    MongooseModule.forFeature([
      { name: Security.name, schema: SecuritySchema },
    ]),
  ],
})
export class DataBaseModule {}
