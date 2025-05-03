import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { RateLimitMiddleware } from './rate-limit.middleware';

@Module({})
export class MiddlewareModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(RateLimitMiddleware)
      .forRoutes('*'); // Aplicar a todas las rutas
  }
} 