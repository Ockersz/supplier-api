import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import helmet from 'helmet';
import * as cookieParser from 'cookie-parser';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(helmet());
  app.enableCors({
    origin: process.env.CORS_ORIGIN || '*', // Allow all origins by default
    allowedHeaders: 'Content-Type, Accept',
  });
  app.use(cookieParser());

  const config = new DocumentBuilder()
    .setTitle('Supplier API')
    .setDescription('The supplier API description')
    .setVersion('1.0')
    .addTag('suppliers')
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, documentFactory);
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
