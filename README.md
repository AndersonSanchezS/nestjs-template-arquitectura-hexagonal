# Backend Template - NestJS

Este es un template de backend desarrollado con NestJS que incluye configuraciones de seguridad, base de datos, manejo de errores y más.

## 🚀 Características Principales

- 🔒 Seguridad robusta con Helmet y CORS
- 🗄️ Base de datos PostgreSQL con TypeORM
- 📊 Pool de conexiones configurable
- 🔄 Sistema de migraciones
- ⚡ Rate Limiting
- 🛡️ Manejo global de excepciones
- 📝 Logging detallado
- 🔄 Compresión de respuestas

## 📁 Estructura del Proyecto

```
src/
├── config/                 # Configuraciones de la aplicación
│   ├── database.config.ts  # Configuración de la base de datos
│   └── migration.config.ts # Configuración de migraciones
├── shared/                 # Código compartido
│   ├── exceptions/         # Manejo de excepciones
│   │   └── http-exception.filter.ts
│   └── middleware/         # Middlewares globales
│       ├── middleware.module.ts
│       └── rate-limit.middleware.ts
├── app.module.ts          # Módulo principal
└── main.ts               # Punto de entrada
```

## 🔧 Configuración

### Variables de Entorno

Crea un archivo `.env` en la raíz del proyecto con las siguientes variables:

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

## 🛡️ Seguridad

### Helmet

Helmet ayuda a proteger la aplicación de vulnerabilidades web conocidas configurando varios headers HTTP. La configuración incluye:

- Content Security Policy (CSP)
- Cross-Origin Embedder Policy
- Cross-Origin Opener Policy
- Cross-Origin Resource Policy
- DNS Prefetch Control
- Frameguard
- Hide Powered-By
- HSTS
- IE No Open
- No Sniff
- Origin Agent Cluster
- Permitted Cross-Domain Policies
- Referrer Policy
- XSS Filter

### CORS

Configuración de CORS para controlar el acceso a la API:

- Origen configurable
- Métodos HTTP permitidos
- Headers permitidos
- Credenciales
- Cache de preflight requests

### Rate Limiting

Protección contra ataques de fuerza bruta:

- 100 peticiones por minuto por IP
- Configurable por ruta
- Logging de intentos excedidos

## 🗄️ Base de Datos

### Configuración

La configuración de la base de datos incluye:

- Conexión a PostgreSQL
- Pool de conexiones configurable
- SSL en producción
- Logging en desarrollo
- Auto-sincronización en desarrollo

### Pool de Conexiones

Configuración del pool de conexiones:

- Máximo de conexiones: 10
- Mínimo de conexiones: 2
- Tiempo de inactividad: 30 segundos
- Tiempo de espera de conexión: 2 segundos

### Migraciones

Sistema de migraciones para control de versiones de la base de datos:

```bash
# Generar una nueva migración
npm run migration:generate -- -n NombreMigracion

# Ejecutar migraciones
npm run migration:run

# Revertir la última migración
npm run migration:revert
```

## 🚨 Manejo de Errores

### Filtro Global de Excepciones

El `HttpExceptionFilter` maneja todas las excepciones de la aplicación:

- Formato consistente de errores
- Logging detallado
- Stack trace en desarrollo
- Manejo específico de errores de base de datos

### Logging

Sistema de logging que incluye:

- Timestamp
- Nivel de error
- Stack trace
- Información de la petición
- Mensaje de error

## 🔄 Optimización

### Compresión

Compresión de respuestas HTTP:

- Nivel de compresión: 6
- Umbral mínimo: 1KB
- Exclusión por header

## 📦 Scripts Disponibles

```bash
# Desarrollo
npm run start:dev

# Producción
npm run start:prod

# Tests
npm run test
npm run test:e2e

# Migraciones
npm run migration:generate
npm run migration:run
npm run migration:revert
```

## 🛠️ Configuración de Desarrollo

### Requisitos

- Node.js >= 16
- PostgreSQL >= 12
- pnpm >= 7

### Instalación

```bash
# Instalar dependencias
pnpm install

# Configurar variables de entorno
cp .env.example .env

# Iniciar base de datos
docker-compose up -d

# Iniciar servidor de desarrollo
pnpm run start:dev
```

## 🔍 Monitoreo y Debugging

### Logging en Desarrollo

En desarrollo, la aplicación muestra:
- Errores detallados
- Stack traces
- Información de la base de datos
- Peticiones HTTP

### Variables de Entorno de Debugging

```env
DEBUG=true
LOG_LEVEL=debug
```

## 🔒 Seguridad en Producción

### Recomendaciones

1. Cambiar todas las contraseñas por defecto
2. Configurar SSL para la base de datos
3. Ajustar límites de rate limiting según necesidades
4. Configurar CORS para dominios específicos
5. Revisar y ajustar políticas de CSP

## 📚 Documentación Adicional

### TypeORM

- [Documentación oficial](https://typeorm.io/)
- [Guía de migraciones](https://typeorm.io/migrations)

### NestJS

- [Documentación oficial](https://docs.nestjs.com/)
- [Guía de seguridad](https://docs.nestjs.com/security)

### PostgreSQL

- [Documentación oficial](https://www.postgresql.org/docs/)
- [Guía de optimización](https://www.postgresql.org/docs/current/runtime-config-query.html)

# Backend Template con Arquitectura Hexagonal

Este proyecto implementa una arquitectura hexagonal (también conocida como arquitectura de puertos y adaptadores) en un proyecto NestJS. La arquitectura está organizada de manera modular, donde cada módulo tiene su propia estructura hexagonal completa.

## Estructura del Proyecto

```
src/
├── modules/                    # Módulos de la aplicación
│   └── author/                # Módulo de autores (ejemplo)
│       ├── domain/            # Capa de dominio (core)
│       │   ├── entities/      # Entidades del dominio
│       │   │   └── author.entity.ts
│       │   ├── repositories/  # Interfaces de repositorios (puertos)
│       │   │   └── author.repository.ts
│       │   └── services/      # Lógica de negocio específica del dominio
│       ├── application/       # Capa de aplicación
│       │   ├── use-cases/     # Casos de uso
│       │   │   ├── create-author.use-case.ts
│       │   │   ├── update-author.use-case.ts
│       │   │   ├── delete-author.use-case.ts
│       │   │   ├── find-all-authors.use-case.ts
│       │   │   └── find-author-by-id.use-case.ts
│       │   └── dto/          # Objetos de transferencia de datos
│       │       ├── create-author.dto.ts
│       │       └── update-author.dto.ts
│       └── infrastructure/    # Capa de infraestructura
│           ├── persistence/   # Implementaciones de repositorios
│           │   └── author.repository.ts
│           ├── controllers/   # Controladores HTTP
│           │   └── author.controller.ts
│           └── config/        # Configuraciones específicas del módulo
└── shared/                    # Utilidades compartidas
```

## Explicación de la Arquitectura

### Capa de Dominio (Core)
- **entities/**: Contiene las entidades del dominio, que representan los conceptos principales del negocio.
  - `author.entity.ts`: Define la estructura y validaciones de la entidad Author usando TypeORM y class-validator.

- **repositories/**: Define las interfaces (puertos) que la capa de dominio necesita para interactuar con el exterior.
  - `author.repository.ts`: Define los métodos que cualquier implementación de repositorio debe proporcionar.

### Capa de Aplicación
- **use-cases/**: Implementa los casos de uso de la aplicación.
  - Cada caso de uso es una clase que implementa una operación específica del negocio.
  - Ejemplos: crear, actualizar, eliminar y consultar autores.

- **dto/**: Define los objetos de transferencia de datos.
  - `create-author.dto.ts`: Define la estructura y validaciones para crear un autor.
  - `update-author.dto.ts`: Define la estructura y validaciones para actualizar un autor.

### Capa de Infraestructura
- **persistence/**: Implementa los repositorios definidos en la capa de dominio.
  - `author.repository.ts`: Implementa la interfaz IAuthorRepository usando TypeORM.

- **controllers/**: Maneja las peticiones HTTP.
  - `author.controller.ts`: Define los endpoints REST y orquesta los casos de uso.

- **config/**: Contiene configuraciones específicas del módulo.

## Proceso de Creación de un Endpoint

### 1. Definir la Entidad
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

### 2. Definir la Interfaz del Repositorio
```typescript
// domain/repositories/author.repository.ts
import { Author } from '../entities/author.entity';

export interface IAuthorRepository {
  create(author: Author): Promise<Author>;
}
```

### 3. Crear el DTO
```typescript
// application/dto/create-author.dto.ts
import { IsString, IsNotEmpty } from 'class-validator';

export class CreateAuthorDto {
  @IsString()
  @IsNotEmpty()
  name: string;
}
```

### 4. Implementar el Caso de Uso
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

### 5. Implementar el Repositorio
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

### 6. Crear el Controlador
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

### 7. Configurar el Módulo
```typescript
// author.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthorController } from './infrastructure/controllers/author.controller';
import { AuthorRepository } from './infrastructure/persistence/author.repository';
import { Author } from './domain/entities/author.entity';
import { CreateAuthorUseCase } from './application/use-cases/create-author.use-case';

@Module({
  imports: [TypeOrmModule.forFeature([Author])],
  controllers: [AuthorController],
  providers: [
    CreateAuthorUseCase,
    {
      provide: 'IAuthorRepository',
      useClass: AuthorRepository,
    },
  ],
})
export class AuthorModule {}
```

## Beneficios de la Arquitectura

1. **Separación de Responsabilidades**: Cada capa tiene una responsabilidad específica y clara.
2. **Testabilidad**: Facilita las pruebas unitarias y de integración.
3. **Mantenibilidad**: Los cambios en una capa no afectan a las otras.
4. **Escalabilidad**: Facilita la adición de nuevas funcionalidades.
5. **Independencia de Tecnologías**: El dominio no depende de tecnologías específicas.

## Ejemplo de Uso

```bash
# Crear un autor
curl -X POST http://localhost:3000/authors \
  -H "Content-Type: application/json" \
  -d '{"name": "Gabriel García Márquez"}'

# Listar autores
curl http://localhost:3000/authors

# Obtener un autor por ID
curl http://localhost:3000/authors/:id

# Actualizar un autor
curl -X PUT http://localhost:3000/authors/:id \
  -H "Content-Type: application/json" \
  -d '{"name": "Gabriel García Márquez"}'

# Eliminar un autor