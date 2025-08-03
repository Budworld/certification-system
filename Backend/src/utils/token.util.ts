import { UnauthorizedException } from '@nestjs/common';

export class TokenUtils {
  static extractTokenFromHeader(authHeader?: string): string {
    if (!authHeader) throw new UnauthorizedException('Missing Authorization header');
    const [type, token] = authHeader.split(' ');
    if (type !== 'Bearer' || !token) throw new UnauthorizedException('Invalid Authorization format');
    return token;
  }
}
