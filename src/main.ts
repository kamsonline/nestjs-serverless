import { ValidationPipe, VersioningType } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

const APP_PORT = parseInt(process.env.HTTP_PORT || '3001');

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe());
  app.enableCors();

  app.enableVersioning({
    type: VersioningType.URI,
  });

  await app.listen(APP_PORT, () => {
    console.log(`🚀 Server ready at: http://localhost:${APP_PORT}`);
  });
}
bootstrap();
