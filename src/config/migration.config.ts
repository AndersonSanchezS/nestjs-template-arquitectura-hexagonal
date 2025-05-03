import { DataSource } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { databaseConfig } from './database.config';

const configService = new ConfigService();

export default new DataSource({
  ...databaseConfig(configService),
  migrationsTableName: 'migrations',
  migrationsRun: configService.get('NODE_ENV') === 'production',
}); 