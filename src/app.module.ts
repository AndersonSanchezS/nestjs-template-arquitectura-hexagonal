import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { databaseConfig } from './config/database.config';
import { ThrottlerModule } from '@nestjs/throttler';
import { ThrottlerGuard } from '@nestjs/throttler';
import { MiddlewareModule } from './shared/middleware/middleware.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(databaseConfig),
    ThrottlerModule.forRoot([{
      ttl: 60000, // Tiempo en milisegundos (1 minuto)
      limit: 100, // Número máximo de peticiones en el tiempo especificado
    }]),
    MiddlewareModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: 'APP_GUARD',
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
