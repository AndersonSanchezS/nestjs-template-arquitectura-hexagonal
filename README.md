# Backend Template

## Configuración de Base de Datos

### Conexión a PostgreSQL con TypeORM

El proyecto utiliza TypeORM para la conexión con PostgreSQL. La configuración se encuentra en `src/config/database.config.ts`:

```typescript
export const databaseConfig: TypeOrmModuleOptions = {
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : 5432,
  username: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  database: process.env.DB_DATABASE || 'nestjs_db',
  entities: [__dirname + '/../**/*.entity{.ts,.js}'],
  synchronize: process.env.NODE_ENV !== 'production',
  logging: process.env.NODE_ENV !== 'production',
  retryAttempts: 10,
  retryDelay: 3000,
  autoLoadEntities: true,
};
```

#### Variables de Entorno Requeridas
- `DB_HOST`: Host de la base de datos (por defecto: localhost)
- `DB_PORT`: Puerto de la base de datos (por defecto: 5432)
- `DB_USERNAME`: Usuario de la base de datos (por defecto: postgres)
- `DB_PASSWORD`: Contraseña de la base de datos (por defecto: postgres)
- `DB_DATABASE`: Nombre de la base de datos (por defecto: nestjs_db)

#### Configuración Docker
La base de datos se ejecuta en un contenedor Docker con la siguiente configuración:
- Imagen: postgres:16-alpine
- Volumen persistente para los datos
- Healthcheck para verificar la disponibilidad
- Configuración de conexiones máximas

## Configuración de Seguridad con Helmet

Helmet se ha configurado para proporcionar una capa robusta de seguridad. La configuración se encuentra en `src/main.ts`:

### Directivas de Content Security Policy (CSP)
- `defaultSrc`: ["'self'"] - Solo permite cargar recursos del mismo origen
- `scriptSrc`: ["'self'"] - Restringe la ejecución de scripts al mismo origen
- `styleSrc`: ["'self'"] - Restringe los estilos CSS al mismo origen
- `imgSrc`: ["'self'", 'data:', 'https:'] - Permite imágenes del mismo origen, data URIs y HTTPS
- `connectSrc`: ["'self'"] - Restringe las conexiones (AJAX, WebSocket) al mismo origen
- `fontSrc`: ["'self'"] - Restringe las fuentes al mismo origen
- `objectSrc`: ["'none'"] - Bloquea plugins como Flash
- `mediaSrc`: ["'self'"] - Restringe los recursos multimedia al mismo origen
- `frameSrc`: ["'none'"] - Bloquea iframes

### Otras Políticas de Seguridad
- `crossOriginEmbedderPolicy`: true - Controla cómo se cargan los recursos de otros orígenes
- `crossOriginOpenerPolicy`: true - Controla cómo se abren ventanas emergentes
- `crossOriginResourcePolicy`: { policy: "same-site" } - Restringe recursos a mismo sitio
- `dnsPrefetchControl`: { allow: false } - Desactiva la precarga de DNS
- `frameguard`: { action: 'deny' } - Previene ataques de clickjacking
- `hidePoweredBy`: true - Oculta el encabezado X-Powered-By
- `hsts`: { maxAge: 31536000, includeSubDomains: true } - Fuerza HTTPS por un año
- `ieNoOpen`: true - Previene descargas automáticas en IE
- `noSniff`: true - Previene MIME type sniffing
- `originAgentCluster`: true - Mejora el aislamiento de origen
- `permittedCrossDomainPolicies`: { permittedPolicies: 'none' } - Bloquea políticas cross-domain
- `referrerPolicy`: { policy: 'no-referrer' } - Controla la información de referente
- `xssFilter`: true - Filtra ataques XSS

## Iniciar el Proyecto

1. Copiar el archivo `.env.example` a `.env` y configurar las variables
2. Ejecutar los contenedores:
```bash
docker-compose up --build
```

La aplicación estará disponible en `http://localhost:3000`
