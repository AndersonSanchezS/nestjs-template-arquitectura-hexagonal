import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { DataSourceOptions } from 'typeorm';
import { ConfigService } from '@nestjs/config';

export const databaseConfig = (configService: ConfigService): DataSourceOptions => {
  const requiredEnvVars = ['DB_HOST', 'DB_PORT', 'DB_USERNAME', 'DB_PASSWORD', 'DB_DATABASE'];
  const missingEnvVars = requiredEnvVars.filter(envVar => !configService.get(envVar));

  if (missingEnvVars.length > 0) {
    console.warn('Warning: Missing required database environment variables:', missingEnvVars.join(', '));
    console.warn('Using default values. This is not recommended for production.');
  }

  return {
    type: 'postgres',
    host: configService.get('DB_HOST') || 'localhost',
    port: parseInt(configService.get('DB_PORT') || '5432', 10),
    username: configService.get('DB_USERNAME') || 'postgres',
    password: configService.get('DB_PASSWORD') || 'postgres',
    database: configService.get('DB_DATABASE') || 'nestjs_db',
    entities: [__dirname + '/../**/*.entity{.ts,.js}'],
    migrations: [__dirname + '/../migrations/*{.ts,.js}'],
    synchronize: configService.get('NODE_ENV') !== 'production',
    logging: configService.get('NODE_ENV') !== 'production',
    ssl: configService.get('NODE_ENV') === 'production' ? {
      rejectUnauthorized: true,
      ca: configService.get('DB_SSL_CA'),
    } : false,
    // Configuración del pool de conexiones
    extra: {
      max: parseInt(configService.get('DB_POOL_MAX') || '10', 10),
      min: parseInt(configService.get('DB_POOL_MIN') || '2', 10),
      idleTimeoutMillis: parseInt(configService.get('DB_POOL_IDLE_TIMEOUT') || '30000', 10),
      connectionTimeoutMillis: parseInt(configService.get('DB_POOL_CONNECTION_TIMEOUT') || '2000', 10),
    },
  };
}; 