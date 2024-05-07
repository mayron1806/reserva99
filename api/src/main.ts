import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { LogInterceptor } from './Interceptors/log.interceptor';
import { ValidationPipe } from '@nestjs/common';
import { PrismaExceptionFilterFilter } from './prisma-exception-filter/prisma-exception-filter.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      stopAtFirstError: true,
    }),
  );
  const { httpAdapter } = app.get(HttpAdapterHost);
  app.useGlobalFilters(new PrismaExceptionFilterFilter(httpAdapter));

  app.useGlobalInterceptors(new LogInterceptor());
  
  app.setGlobalPrefix('api');
  app.enableCors({
    allowedHeaders: '*',
    methods: "*",
    origin: '*',
  });

  await app.listen(8081);
}
bootstrap();
