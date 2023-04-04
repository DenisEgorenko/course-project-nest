import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { BadRequestException, ValidationPipe } from '@nestjs/common';
import { HttpExceptionFilter } from './exceptionFilter/exception.filter';
import cookieParser from 'cookie-parser';
// import * as cookieParser from 'cookie-parser';
import { useContainer } from 'class-validator';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  app.use(cookieParser());
  app.useGlobalPipes(
    new ValidationPipe({
      stopAtFirstError: true,
      exceptionFactory: (errors) => {
        throw new BadRequestException(
          errors.map((e) => ({
            field: e.property,
            message: e.constraints[Object.keys(e.constraints)[0]],
          })),
        );
      },
    }),
  );
  app.useGlobalFilters(new HttpExceptionFilter());

  const config = app.get<ConfigService>(ConfigService);
  const port = config.get('app.port');

  useContainer(app.select(AppModule), { fallbackOnErrors: true });

  await app.listen(port);
}

bootstrap();
