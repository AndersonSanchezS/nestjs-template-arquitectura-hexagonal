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

## Validación de Datos con ValidationPipe

El proyecto utiliza ValidationPipe de NestJS junto con class-validator para la validación de datos. La configuración se encuentra en `src/main.ts`:

```typescript
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
  }),
);
```

### Explicación de las Directivas del ValidationPipe

1. **whitelist: true**
   - Elimina automáticamente cualquier propiedad que no esté definida en el DTO
   - Ayuda a prevenir la inyección de datos no deseados
   - Ejemplo: Si el DTO espera `{ name: string }` y se recibe `{ name: string, extra: any }`, se eliminará `extra`

2. **forbidNonWhitelisted: true**
   - Lanza un error cuando se reciben propiedades no definidas en el DTO
   - Complementa a `whitelist` al hacer explícito el error
   - Ejemplo: Si se envía `{ name: string, extra: any }` a un DTO que solo espera `name`, se lanzará un error

3. **transform: true**
   - Transforma automáticamente los tipos de datos según las definiciones del DTO
   - Convierte strings a números, fechas, etc.
   - Ejemplo: Si el DTO espera `age: number` y se recibe `age: "25"`, lo convertirá a `25`

4. **transformOptions: { enableImplicitConversion: true }**
   - Permite la conversión implícita de tipos
   - Facilita el manejo de datos sin necesidad de decoradores adicionales
   - Ejemplo: Convierte automáticamente strings a números cuando el tipo esperado es numérico

5. **validationError: { target: false, value: true }**
   - Configura el formato de los mensajes de error
   - `target: false` - No incluye el objeto completo en el error
   - `value: true` - Incluye el valor inválido en el mensaje de error
   - Ejemplo de error: `"password must be longer than or equal to 8 characters"` en lugar de mostrar todo el objeto

### Uso de Decoradores de Validación

El proyecto utiliza class-validator para definir las reglas de validación. Algunos decoradores comunes son:

- `@IsString()` - Valida que el valor sea una cadena de texto
- `@IsEmail()` - Valida que el valor sea un email válido
- `@IsNotEmpty()` - Valida que el valor no esté vacío
- `@MinLength()` - Valida la longitud mínima de una cadena
- `@MaxLength()` - Valida la longitud máxima de una cadena
- `@Matches()` - Valida contra una expresión regular

## Railway Oriented Programming (ROP)

Railway Oriented Programming es un patrón de programación funcional que nos permite manejar el flujo de operaciones de manera más elegante y predecible. En lugar de usar excepciones o valores nulos, ROP utiliza un tipo `Result` que puede ser `Success` o `Failure`, permitiendo encadenar operaciones de manera segura.

### Estructura de Archivos

#### 1. `src/shared/domain/result/result.ts`

Este archivo define la estructura base del patrón ROP:

- `Result<T, E>`: Tipo genérico que puede ser `Success<T>` o `Failure<E>`
- `Success<T>`: Clase que representa un resultado exitoso
- `Failure<E>`: Clase que representa un resultado fallido
- `success<T>(value: T)`: Función helper para crear un resultado exitoso
- `failure<E>(error: E)`: Función helper para crear un resultado fallido

#### 2. `src/shared/domain/result/result.utils.ts`

Contiene funciones utilitarias para trabajar con `Result`:

- `map<T, U, E>(result: Result<T, E>, fn: (value: T) => U)`: Transforma el valor de un resultado exitoso
- `flatMap<T, U, E>(result: Result<T, E>, fn: (value: T) => Result<U, E>)`: Encadena operaciones que devuelven Result
- `getOrElse<T, E>(result: Result<T, E>, defaultValue: T)`: Obtiene el valor o un valor por defecto
- `getOrThrow<T, E>(result: Result<T, E>)`: Obtiene el valor o lanza el error
- `fold<T, U, E>(result: Result<T, E>, onSuccess: (value: T) => U, onFailure: (error: E) => U)`: Maneja ambos casos (éxito/fallo)

#### 3. `src/shared/domain/errors/domain.error.ts`

Define una jerarquía de errores de dominio:

- `DomainError`: Clase base para todos los errores de dominio
- `ValidationError`: Para errores de validación
- `NotFoundError`: Para recursos no encontrados
- `ConflictError`: Para conflictos (ej: duplicados)

### Ejemplo de Uso

```typescript
// Ejemplo de una operación que puede fallar
const validateEmail = (email: string): Result<string, ValidationError> => {
  if (!email.includes('@')) {
    return failure(new ValidationError('Email inválido'));
  }
  return success(email);
};

// Encadenamiento de operaciones
const result = validateEmail('user@example.com')
  .flatMap(email => createUser(email))
  .map(user => sendWelcomeEmail(user));

// Manejo del resultado
fold(
  result,
  user => console.log('Usuario creado:', user),
  error => console.error('Error:', error.message)
);
```

### Beneficios de ROP

1. **Manejo explícito de errores**: Los errores son parte del tipo de retorno, no excepciones ocultas
2. **Composición de funciones**: Las operaciones se pueden encadenar de manera segura
3. **Tipado fuerte**: TypeScript nos ayuda a manejar todos los casos posibles
4. **Código más predecible**: El flujo de la aplicación es más fácil de seguir
5. **Mantenibilidad**: Las funciones son más pequeñas y enfocadas en una sola responsabilidad

### Patrones Comunes

1. **Railway Pattern**: Encadenar operaciones que pueden fallar
2. **Error Handling**: Manejar errores de manera funcional
3. **Data Transformation**: Transformar datos de manera segura
4. **Validation**: Validar datos antes de procesarlos

## Iniciar el Proyecto

1. Copiar el archivo `.env.example` a `.env` y configurar las variables
2. Ejecutar los contenedores:
```bash
docker-compose up --build
```

La aplicación estará disponible en `http://localhost:3000`
