import { TypeOrmModuleAsyncOptions } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { join } from 'path';
import { DataSource } from 'typeorm';

export const typeOrmAsyncConfig: TypeOrmModuleAsyncOptions = {
  imports: [ConfigModule],
  inject: [ConfigService],
  useFactory: async (configService: ConfigService) => ({
    type: 'mssql',
    host: configService.get<string>('dbHost'),
    port: Number(configService.get<string>('dbPort')) || 1433,
    username: configService.get<string>('dbUsername'),
    password: configService.get<string>('dbPassword'),
    database: configService.get<string>('dbName'),
    synchronize: false,
    logging: true,
    options: {
      instanceName: configService.get('dbInstance'),
      trustServerCertificate: true,
      enableArithAbort: true,
      encrypt: false,
      trustedConnection: true,
    },
    instanceName: configService.get('dbInstance'),
    entities: [join(__dirname, '..', '**', '*.entity.{ts,js}')],
    extra: {
      trustServerCertificate: true,
    },
  }),
  dataSourceFactory: async (options) => new DataSource(options).initialize(),
};
