import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { BadRequestException, ValidationPipe } from '@nestjs/common';
import { HttpExceptionFilter } from './exceptionFilter/exception.filter';
import cookieParser from 'cookie-parser';
// import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  app.use(cookieParser());
  app.useGlobalPipes(
    new ValidationPipe({
      // forbidUnknownValues: false,
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
  await app.listen(3000);
}

bootstrap();
