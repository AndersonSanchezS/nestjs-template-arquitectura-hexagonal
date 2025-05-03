# Backend Template - NestJS

## 📋 Tabla de Contenidos
1. [Introducción](#-introducción)
2. [Arquitectura](#-arquitectura)
3. [Configuración](#-configuración)
4. [Seguridad](#-seguridad)
5. [Base de Datos](#-base-de-datos)
6. [Manejo de Errores](#-manejo-de-errores)
7. [Formatos de Respuesta](#-formatos-de-respuesta)
8. [Validación](#-validación)
9. [Desarrollo](#-desarrollo)
10. [Producción](#-producción)
11. [Ejemplos de Uso](#-ejemplos-de-uso)
12. [Recursos Adicionales](#-recursos-adicionales)

## 🎯 Introducción

Este es un template de backend desarrollado con NestJS que implementa una arquitectura hexagonal (ports and adapters) y sigue las mejores prácticas de desarrollo. El proyecto está diseñado para ser escalable, mantenible y seguro desde el inicio.

### Características Principales
- 🔒 Seguridad robusta con Helmet y CORS
- 🗄️ Base de datos PostgreSQL con TypeORM
- 📊 Pool de conexiones configurable
- 🔄 Sistema de migraciones
- ⚡ Rate Limiting
- 🛡️ Manejo global de excepciones
- 📝 Logging detallado
- 🔄 Compresión de respuestas

## 🏗️ Arquitectura

### Estructura del Proyecto
```
src/
├── modules/                    # Módulos de la aplicación
│   └── author/                # Módulo de ejemplo
│       ├── domain/            # Capa de dominio
│       │   ├── entities/      # Entidades del dominio
│       │   │   └── author.entity.ts
│       │   ├── repositories/  # Interfaces de repositorios
│       │   │   └── author.repository.ts
│       │   └── services/      # Lógica de negocio
│       ├── application/       # Capa de aplicación
│       │   ├── use-cases/     # Casos de uso
│       │   │   ├── create-author.use-case.ts
│       │   │   ├── update-author.use-case.ts
│       │   │   ├── delete-author.use-case.ts
│       │   │   ├── find-all-authors.use-case.ts
│       │   │   └── find-author-by-id.use-case.ts
│       │   └── dto/          # Objetos de transferencia
│       │       ├── create-author.dto.ts
│       │       └── update-author.dto.ts
│       └── infrastructure/    # Capa de infraestructura
│           ├── persistence/   # Implementaciones
│           │   └── author.repository.ts
│           ├── controllers/   # Controladores HTTP
│           │   └── author.controller.ts
│           └── config/        # Configuraciones
└── shared/                    # Utilidades compartidas
```

### Capas de la Arquitectura

#### 1. Capa de Dominio (Core)
- **Entidades**: Representan los conceptos principales del negocio
  ```typescript
  // domain/entities/author.entity.ts
  import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
  import { IsString, IsNotEmpty } from 'class-validator';

  @Entity('authors')
  export class Author {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    @IsString()
    @IsNotEmpty()
    name: string;
  }
  ```

- **Repositorios**: Interfaces que definen cómo interactuar con el almacenamiento
  ```typescript
  // domain/repositories/author.repository.ts
  import { Author } from '../entities/author.entity';

  export interface IAuthorRepository {
    create(author: Author): Promise<Author>;
    findById(id: string): Promise<Author | null>;
    findAll(): Promise<Author[]>;
    update(id: string, author: Partial<Author>): Promise<Author>;
    delete(id: string): Promise<void>;
  }
  ```

- **Servicios**: Lógica de negocio específica del dominio

#### 2. Capa de Aplicación
- **Casos de Uso**: Implementan las operaciones del negocio
  ```typescript
  // application/use-cases/create-author.use-case.ts
  import { Injectable, Inject } from '@nestjs/common';
  import { IAuthorRepository } from '../../domain/repositories/author.repository';
  import { CreateAuthorDto } from '../dto/create-author.dto';

  @Injectable()
  export class CreateAuthorUseCase {
    constructor(
      @Inject('IAuthorRepository')
      private readonly authorRepository: IAuthorRepository,
    ) {}

    async execute(authorData: CreateAuthorDto) {
      return this.authorRepository.create(authorData);
    }
  }
  ```

- **DTOs**: Objetos de transferencia de datos con validaciones
  ```typescript
  // application/dto/create-author.dto.ts
  import { IsString, IsNotEmpty, IsEmail } from 'class-validator';

  export class CreateAuthorDto {
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsEmail()
    @IsNotEmpty()
    email: string;
  }
  ```

#### 3. Capa de Infraestructura
- **Controladores**: Manejan las peticiones HTTP
  ```typescript
  // infrastructure/controllers/author.controller.ts
  import { Controller, Post, Body } from '@nestjs/common';
  import { CreateAuthorUseCase } from '../../application/use-cases/create-author.use-case';
  import { CreateAuthorDto } from '../../application/dto/create-author.dto';

  @Controller('authors')
  export class AuthorController {
    constructor(private readonly createAuthorUseCase: CreateAuthorUseCase) {}

    @Post()
    async create(@Body() authorData: CreateAuthorDto) {
      return this.createAuthorUseCase.execute(authorData);
    }
  }
  ```

- **Repositorios**: Implementaciones concretas
  ```typescript
  // infrastructure/persistence/author.repository.ts
  import { Injectable } from '@nestjs/common';
  import { InjectRepository } from '@nestjs/typeorm';
  import { Repository } from 'typeorm';
  import { IAuthorRepository } from '../../domain/repositories/author.repository';
  import { Author } from '../../domain/entities/author.entity';

  @Injectable()
  export class AuthorRepository implements IAuthorRepository {
    constructor(
      @InjectRepository(Author)
      private readonly typeOrmRepository: Repository<Author>,
    ) {}

    async create(authorData: Author): Promise<Author> {
      const author = this.typeOrmRepository.create(authorData);
      return this.typeOrmRepository.save(author);
    }
  }
  ```

- **Configuraciones**: Configuraciones específicas del módulo

## ⚙️ Configuración

### Variables de Entorno
```env
# Entorno
NODE_ENV=development

# Servidor
PORT=3000
CORS_ORIGIN=http://localhost:3000

# Base de datos
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_DATABASE=nestjs_db

# Pool de conexiones
DB_POOL_MAX=10
DB_POOL_MIN=2
DB_POOL_IDLE_TIMEOUT=30000
DB_POOL_CONNECTION_TIMEOUT=2000

# Rate Limiting
THROTTLE_TTL=60000
THROTTLE_LIMIT=100
```

### Configuración de la Base de Datos
```typescript
// config/database.config.ts
export const databaseConfig = (configService: ConfigService): DataSourceOptions => {
  return {
    type: 'postgres',
    host: configService.get('DB_HOST'),
    port: parseInt(configService.get('DB_PORT'), 10),
    username: configService.get('DB_USERNAME'),
    password: configService.get('DB_PASSWORD'),
    database: configService.get('DB_DATABASE'),
    entities: [__dirname + '/../**/*.entity{.ts,.js}'],
    migrations: [__dirname + '/../migrations/*{.ts,.js}'],
    synchronize: configService.get('NODE_ENV') !== 'production',
    logging: configService.get('NODE_ENV') !== 'production',
    ssl: configService.get('NODE_ENV') === 'production' ? {
      rejectUnauthorized: true,
      ca: configService.get('DB_SSL_CA'),
    } : false,
    extra: {
      max: parseInt(configService.get('DB_POOL_MAX'), 10),
      min: parseInt(configService.get('DB_POOL_MIN'), 10),
      idleTimeoutMillis: parseInt(configService.get('DB_POOL_IDLE_TIMEOUT'), 10),
      connectionTimeoutMillis: parseInt(configService.get('DB_POOL_CONNECTION_TIMEOUT'), 10),
    },
  };
};
```

## 🛡️ Seguridad

### 1. Helmet
Configuración de seguridad HTTP:
```typescript
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
```

### 2. CORS
```typescript
app.enableCors({
  origin: process.env.CORS_ORIGIN || '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  exposedHeaders: ['Content-Range', 'X-Content-Range'],
  credentials: true,
  maxAge: 3600,
});
```

### 3. Rate Limiting
```typescript
ThrottlerModule.forRoot([{
  ttl: 60000, // 1 minuto
  limit: 100, // 100 peticiones por minuto
}]),
```

## 🗄️ Base de Datos

### 1. Configuración
- PostgreSQL con TypeORM
- Pool de conexiones configurable
- SSL en producción
- Logging en desarrollo
- Auto-sincronización en desarrollo

### 2. Pool de Conexiones
- Máximo: 10 conexiones
- Mínimo: 2 conexiones
- Tiempo de inactividad: 30 segundos
- Tiempo de espera: 2 segundos

### 3. Migraciones
```bash
# Generar migración
npm run migration:generate -- -n NombreMigracion

# Ejecutar migraciones
npm run migration:run

# Revertir migración
npm run migration:revert
```

## 🚨 Manejo de Errores

### 1. Filtro Global de Excepciones
```typescript
@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Internal server error';
    let data: any = null;

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const exceptionResponse = exception.getResponse();
      
      if (typeof exceptionResponse === 'string') {
        message = exceptionResponse;
      } else {
        message = exceptionResponse['message'] || exception.message;
        data = exceptionResponse['data'];
      }
    }

    const errorResponse: ErrorResponse = {
      error: status >= 400,
      message,
    };

    if (data !== null && data !== undefined) {
      errorResponse.data = data;
    }

    response.status(status).json(errorResponse);
  }
}
```

### 2. Logging
- Timestamp
- Nivel de error
- Stack trace
- Información de la petición
- Mensaje de error

## 📝 Formatos de Respuesta

### 1. Respuestas Exitosas
```json
{
  "error": false,
  "message": "Mensaje de éxito descriptivo",
  "data": { ... } // Opcional
}
```

### 2. Respuestas de Error
```json
{
  "error": true,
  "message": "Mensaje de error descriptivo",
  "data": { ... } // Opcional
}
```

### 3. Ejemplos

#### Creación Exitosa
```json
{
  "error": false,
  "message": "Author created successfully",
  "data": {
    "id": "123e4567-e89b-12d3-a456-426614174000",
    "name": "John",
    "lastName": "Doe",
    "email": "john.doe@example.com"
  }
}
```

#### Error de Validación
```json
{
  "error": true,
  "message": "El email debe ser una dirección de correo válida"
}
```

#### Error de Duplicado
```json
{
  "error": true,
  "message": "Author with this email already exists"
}
```

## ✅ Validación

### 1. Configuración del ValidationPipe
```typescript
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
})
```

### 2. Características
- Validación estricta de DTOs
- Transformación automática de tipos
- Detención al primer error
- Mensajes en español
- Validación de tipos y formatos

## 🛠️ Desarrollo

### 1. Requisitos
- Node.js >= 16
- PostgreSQL >= 12
- pnpm >= 7

### 2. Instalación
```bash
# Instalar dependencias
pnpm install

# Configurar variables
cp .env.example .env

# Iniciar base de datos
docker-compose up -d

# Iniciar servidor
pnpm run start:dev
```

### 3. Scripts Disponibles
```bash
# Desarrollo
npm run start:dev

# Producción
npm run start:prod

# Tests
npm run test
npm run test:e2e
```

## 🚀 Producción

### 1. Recomendaciones
- Cambiar contraseñas por defecto
- Configurar SSL para la base de datos
- Ajustar límites de rate limiting
- Configurar CORS para dominios específicos
- Revisar políticas de CSP

### 2. Monitoreo
- Errores detallados
- Stack traces
- Información de base de datos
- Peticiones HTTP

### 3. Variables de Debugging
```env
DEBUG=true
LOG_LEVEL=debug
```

## 📚 Recursos Adicionales

### TypeORM
- [Documentación oficial](https://typeorm.io/)
- [Guía de migraciones](https://typeorm.io/migrations)

### NestJS
- [Documentación oficial](https://docs.nestjs.com/)
- [Guía de seguridad](https://docs.nestjs.com/security)

### PostgreSQL
- [Documentación oficial](https://www.postgresql.org/docs/)
- [Guía de optimización](https://www.postgresql.org/docs/current/runtime-config-query.html)