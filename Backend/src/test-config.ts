import { ConfigModule, ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { Module } from '@nestjs/common';
import env from './configs/env';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [env],
    }),
  ],
  providers: [],
})
class TestConfigModule {}

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(TestConfigModule);
  const config = app.get(ConfigService);

  console.log('[TEST] dbHost:', config.get('dbHost'));
  console.log('[TEST] dbUsername:', config.get('dbUsername'));
  console.log('[TEST] jwtPrivateKey length:', config.get<string>('jwtPrivateKey'));
  console.log('[TEST] port:', config.get('port'));

  await app.close();
}

bootstrap();

//Run this command to test: npx ts-node -r tsconfig-paths/register src/test-config.ts
