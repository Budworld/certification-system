import {
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload, TokenExpiredError } from 'jsonwebtoken';
import { BcryptUtil } from 'src/utils/bcrypt.util';
import { UserService } from 'src/module/user/services/user.service';
import { plainToInstance } from 'class-transformer';
import { UserResponseDto } from 'src/module/user/dtos/user.response.dto';

@Injectable()
export class TokenService {
  private readonly refreshTokenTtl: number;
  private readonly expiresInDefault: string | number;
  private readonly logger = new Logger(TokenService.name);

  constructor(
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
  ) {
    this.refreshTokenTtl = this.configService.get('jwtRefreshTokenExpire');
    this.expiresInDefault = this.configService.get('jwtAccessTokenExpire');
  }

  async refreshAccessToken(oldAccessToken: string, oldRefreshToken: string) {
    // Validate old access token and get user id
    let sub: string;
    try {
      const claims = await this.validateToken(oldAccessToken, true); // ignore expiration
      this.logger.debug('Claims: ' + claims.sub);
      sub = claims.sub;
    } catch {
      throw new UnauthorizedException('Invalid access token');
    }

    // Validate old access token to make sure it's expired
    try {
      await this.validateToken(oldAccessToken); // don't ignore expiration
      // If no error is thrown above, token is still valid => reject refresh
      throw new UnauthorizedException('Access token is still valid. Refresh not allowed.');
    } catch (error) {
      if (!(error instanceof TokenExpiredError)) {
        // Other errors = invalid token
        throw new UnauthorizedException('Invalid access token');
      }
      // If expired => continue to refresh
    }

    // Find user and refresh token by user id and validate
    const user = await this.userService.findUserById(Number.parseInt(sub));
    this.logger.debug('Found user: ' + JSON.stringify(user));

    if (!user?.refreshToken) {
      throw new NotFoundException('User or refresh token not found');
    }

    // Compare old refresh token with refresh token in database by hash
    const isValid = await BcryptUtil.compare(oldRefreshToken, user.refreshToken);
    this.logger.debug('Is refresh token valid: ' + isValid);
    if (!isValid) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    // Validate refresh token
    try {
      const refreshTokenClaim = await this.validateToken(oldRefreshToken);
      this.logger.debug('Refresh token claim: ' + JSON.stringify(refreshTokenClaim));
    } catch (error) {
      if (error instanceof TokenExpiredError) {
        throw new UnauthorizedException('Refresh token has expired');
      } else {
        throw new UnauthorizedException('Invalid refresh token');
      }
    }

    // Refresh token is still valid
    // Generate new access token and refresh token
    const accessToken = await this.createAccessToken({ sub: sub });
    const refreshToken = await this.createRefreshToken({ sub: sub });

    const hashedRefreshToken = await BcryptUtil.hash(refreshToken);

    // Save new refresh token to db
    await this.userService.saveRefreshToken(hashedRefreshToken, user.userUID);
    return {
      accessToken: accessToken,
      refreshToken: refreshToken,
      user: plainToInstance(UserResponseDto, user, { excludeExtraneousValues: true }),
    };
  }

  async createAccessToken(payload: JwtPayload, expireAt = this.expiresInDefault) {
    return await this.jwtService.signAsync(
      { ...payload },
      {
        expiresIn: expireAt,
      },
    );
  }

  async createRefreshToken(payload: JwtPayload, expireAt = this.refreshTokenTtl): Promise<string> {
    return this.jwtService.signAsync(
      { ...payload },
      {
        expiresIn: expireAt,
      },
    );
  }

  async validateToken(token: string, ignoreExpiration = false): Promise<JwtPayload> {
    return this.jwtService.verifyAsync<JwtPayload>(token, {
      ignoreExpiration,
      algorithms: ['RS256'],
    });
  }
}
