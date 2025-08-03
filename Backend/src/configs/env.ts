import * as fs from 'fs';
import * as path from 'path';

export default () => ({
  port: parseInt(process.env.PORT) || 3000,
  nodeEnv: process.env.NODE_ENV || 'dev',
  jwtPrivateKey: fs.readFileSync(path.resolve('./keys/private-key.pem'), 'utf8'),
  jwtPublicKey: fs.readFileSync(path.resolve('./keys/public-key.pem'), 'utf8'),
  jwtAccessTokenExpire: process.env.JWT_ACCESS_TOKEN_EXPIRES_IN || '15m',
  jwtRefreshTokenExpire: process.env.JWT_REFRESH_TOKEN_EXPIRES_IN || '7d',
  dbHost: process.env.DB_HOST,
  dbPort: process.env.DB_PORT,
  dbUsername: process.env.DB_USERNAME,
  dbPassword: process.env.DB_PASSWORD,
  dbName: process.env.DB_NAME,
  dbInstance: process.env.DB_INSTANCE,
});
