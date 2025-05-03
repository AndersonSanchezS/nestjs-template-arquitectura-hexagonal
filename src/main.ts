import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import helmet from 'helmet';
import { ValidationPipe } from '@nestjs/common';
import * as compression from 'compression';
import { ThrottlerGuard } from '@nestjs/throttler';
import { HttpExceptionFilter } from './shared/exceptions/http-exception.filter';
import { HttpException, HttpStatus } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Configuración de compresión
  app.use(compression({
    level: 6, // Nivel de compresión (0-9)
    threshold: 1024, // Tamaño mínimo para comprimir (1KB)
    filter: (req, res) => {
      if (req.headers['x-no-compression']) {
        return false;
      }
      return compression.filter(req, res);
    },
  }));

  // Configuración de CORS
  app.enableCors({
    origin: process.env.CORS_ORIGIN || '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    exposedHeaders: ['Content-Range', 'X-Content-Range'],
    credentials: true,
    maxAge: 3600,
  });
  
  // Configuración de Helmet
  app.use(helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
        styleSrc: ["'self'", "'unsafe-inline'", "https:"],
        imgSrc: ["'self'", 'data:', 'https:', 'blob:'],
        connectSrc: ["'self'", "https://*", "wss://*"],
        fontSrc: ["'self'", "https:", "data:"],
        objectSrc: ["'none'"],
        mediaSrc: ["'self'", "https:", "blob:"],
        frameSrc: ["'self'"],
        workerSrc: ["'self'", "blob:"],
        childSrc: ["'self'", "blob:"],
        formAction: ["'self'"],
        upgradeInsecureRequests: [],
      },
    },
    crossOriginEmbedderPolicy: true,
    crossOriginOpenerPolicy: true,
    crossOriginResourcePolicy: { policy: "same-site" },
    dnsPrefetchControl: { allow: false },
    frameguard: { action: 'deny' },
    hidePoweredBy: true,
    hsts: { 
      maxAge: 31536000, 
      includeSubDomains: true,
      preload: true
    },
    ieNoOpen: true,
    noSniff: true,
    originAgentCluster: true,
    permittedCrossDomainPolicies: { permittedPolicies: 'none' },
    referrerPolicy: { policy: 'no-referrer' },
    xssFilter: true,
  }));

  // Configuración del ValidationPipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
      validationError: {
        target: false,
        value: true,
      },
      stopAtFirstError: true,
      exceptionFactory: (errors) => {
        const firstError = errors[0];
        const constraints = firstError.constraints || {};
        const firstConstraint = Object.values(constraints)[0] || 'Error de validación';
        
        return new HttpException(
          {
            message: firstConstraint,
            property: firstError.property,
            value: firstError.value,
          },
          HttpStatus.BAD_REQUEST,
        );
      },
    }),
  );

  // Registro del filtro de excepciones global
  app.useGlobalFilters(new HttpExceptionFilter());

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
