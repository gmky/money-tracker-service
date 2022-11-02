import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as compression from 'compression';
import helmet from 'helmet';
import { AppModule } from './app.module';
import { CorsConfig, OpenApiConfig } from './shared/config';
import { ServerConfig } from './shared/config/server.config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const confService = app.get(ConfigService);

  const corsConfig = confService.get<CorsConfig>('security.cors');

  app.enableCors(corsConfig);
  app.use(compression());
  app.use(helmet());

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  );

  const oaConfig = confService.get<OpenApiConfig>('openapi');

  const apiDocs = new DocumentBuilder()
    .setTitle(oaConfig.title)
    .setVersion(oaConfig.version)
    .setDescription(oaConfig.version)
    .addBearerAuth()
    .build();

  const sgDocs = SwaggerModule.createDocument(app, apiDocs);
  SwaggerModule.setup(oaConfig.path, app, sgDocs);
  const serverConfig = confService.get<ServerConfig>('server');

  await app.listen(serverConfig.port);
}
bootstrap();
