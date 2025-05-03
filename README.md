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
