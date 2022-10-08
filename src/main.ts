import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

// TODO: Test and maybe remove alowed domains
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // app.enableCors();
  app.enableCors({
    // TODO: Test and uncomment this. Should accept only requests from known domains (take into account mobile phones tho)
    // origin: process.env.FRONTEND_URL,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    // TODO: Maybe some of these headers are not needed
    allowedHeaders:
      'Content-Type, Accept, X-Requested-With, Content-Type, Authorization',
  });
  app.useGlobalPipes(new ValidationPipe());
  await app.listen(3001);
}
bootstrap();
