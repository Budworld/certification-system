import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { UserService } from './services/user.service';
import { RoleService } from '../role/services/role.service';
import { UserController } from './controllers/user.controller';
import { TokenService } from '../auth';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  providers: [UserService, RoleService, TokenService, JwtService],
  exports: [UserService],
  controllers: [UserController],
})
export class UserModule {}
