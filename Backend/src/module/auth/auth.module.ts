import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtModule, JwtModuleOptions } from '@nestjs/jwt';
import { AuthService } from './services/auth.service';
import { TokenService } from './services/token.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../user/entities/user.entity';
import { AuthController } from './controllers/auth.controller';
import { UserService } from '../user/services/user.service';
import { RoleService } from '../role/services/role.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    JwtModule.registerAsync({
      useFactory: async (configService: ConfigService) => {
        const options: JwtModuleOptions = {
          privateKey: configService.get<string>('jwtPrivateKey'),
          publicKey: configService.get<string>('jwtPublicKey'),
          signOptions: {
            issuer: 'AuthService',
            algorithm: 'RS256',
          },
        };
        return options;
      },
      inject: [ConfigService],
    }),
  ],
  providers: [AuthService, TokenService, UserService, RoleService],
  exports: [AuthService],
  controllers: [AuthController],
})
export class AuthModule {}
