import { ValidationPipe, HttpStatus } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import * as cookieParser from 'cookie-parser';

import { AppModule } from './app.module';
// import { ALLOWED_ORIGINS } from './utils/ALLOWED_ORIGINS';

// TODO: Test and maybe remove alowed domains
async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // app.use(cookieParser(process.env.REFRESH_TOKEN_SECRET));
  // app.use(cookieParser());

  app.enableCors({
    // TODO: Test and uncomment this. Should accept only requests from known domains (take into account mobile phones tho)
    origin: process.env.FRONTEND_URL,
    credentials: true,
    // TODO: Maybe some of the moethods are not needed
    // methods: 'OPTIONS,CONNECT,GET,HEAD,PUT,PATCH,POST,DELETE',
    // TODO: Maybe some of these headers are not needed
    // allowedHeaders:
    //   'Content-Type, Accept, X-Requested-With, Authorization, Origin',
    optionsSuccessStatus: HttpStatus.OK,
  });

  app.use(cookieParser());
  // app.use(cookieParser(process.env.REFRESH_TOKEN_SECRET));

  // app.use(cookieParser());
  app.useGlobalPipes(new ValidationPipe());
  await app.listen(3001);
}
bootstrap();
