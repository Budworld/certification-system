import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import { isDefined } from 'class-validator';
import { TokenExpiredError } from '@nestjs/jwt';
import { UserService } from 'src/module/user/services/user.service';
import { TokenService } from '../services/token.service';
import { TokenUtils } from 'src/utils';

@Injectable()
export class AuthGuard implements CanActivate {
  private readonly logger = new Logger(AuthGuard.name);
  constructor(
    private readonly reflector: Reflector,
    private tokenService: TokenService,
    private userService: UserService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const requiredPermissions = this.reflector.get<string[]>('permissions', context.getHandler());

    const token = TokenUtils.extractTokenFromHeader(request.headers['authorization']);
    this.logger.debug('Access token: ' + token);
    if (!isDefined(token)) {
      throw new UnauthorizedException('Missing access token');
    }

    let sub: string;
    try {
      const claims = await this.tokenService.validateToken(token);
      sub = claims.sub;
      this.logger.debug('Decoded token: ' + claims);
    } catch (error) {
      if (error instanceof TokenExpiredError) throw new UnauthorizedException('Access token expired');
      throw new UnauthorizedException('Invalid access token');
    }

    const loggedUser = await this.userService.findUserById(Number.parseInt(sub));
    request['user'] = loggedUser;

    // return this.checkPermission(requiredPermissions, loggedUser.roleName);
    return true;
  }

  // private checkPermission(requiredPermissions: string[], loggedRole: LoggedRole) {
  //   if (!isDefined(requiredPermissions)) {
  //     this.logger.debug('No required permissions');
  //     return true;
  //   }

  //   if (!isDefined(loggedRole) || !isDefined(loggedRole.permissions) || loggedRole.permissions.length === 0) {
  //     this.logger.debug('Logged user has a role with no permission');
  //     throw new ForbiddenException('Logged user has a role with no permission');
  //   }

  //   const rolePermissions: string[] = loggedRole.permissions
  //     .filter((permission) => isDefined(permission.key))
  //     .map((permission) => permission.key);
  //   for (const requiredPermission of requiredPermissions) {
  //     if (!rolePermissions.includes(requiredPermission)) {
  //       this.logger.debug('Missing required permission: ' + requiredPermission);
  //       throw new ForbiddenException('Missing required permission');
  //     }
  //   }
  //   this.logger.debug('All required permissions approved');
  //   return true;
  // }
}
