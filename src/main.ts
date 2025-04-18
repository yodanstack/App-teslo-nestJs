import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import { AppModule } from './app.module';


async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const logger = new Logger('bootstrap')

  app.setGlobalPrefix('api')

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true
    })
  );

  //blocke para crear la documentacion del api
  const config =  new DocumentBuilder() 
  .setTitle('Teslo RESTful API')
  .setDescription('Teslo shop EndPoints')
  .setVersion('1.0')
  .build()

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document)
  

  await app.listen(process.env.APP_PORT || 3000);
  logger.log(`app runing in port ${process.env.APP_PORT}`);
}
bootstrap();
