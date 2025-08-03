import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { TokenService } from './token.service';
import { RegisterRequestDto } from '../dtos/register.request.dto';
import { BcryptUtil } from 'src/utils/bcrypt.util';
import { LoginRequestDto } from '../dtos/login.request.dto';
import { LoginResponseDto } from '../dtos/login.response.dto';
import { UserService } from 'src/module/user/services/user.service';
import { plainToInstance } from 'class-transformer';
import { UserResponseDto } from 'src/module/user/dtos/user.response.dto';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  constructor(
    private readonly tokenService: TokenService,
    private readonly userService: UserService,
  ) {}

  async register({ username, password, roleName, name, phone, email }: RegisterRequestDto) {
    const existingUser = await this.userService.findUserByUsername(username);

    if (existingUser) {
      throw new ConflictException('This username already exists');
    }

    const hashedPassword = await BcryptUtil.hash(password);

    await this.userService.createUser({ username, hashedPassword, name, roleName, phone, email });
  }

  async login({ username, password }: LoginRequestDto): Promise<LoginResponseDto> {
    const user = await this.userService.findUserByUsername(username);

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await BcryptUtil.compare(password, user.hashedPassword);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Generate tokens
    const payload = { sub: user.userUID.toString() };
    const accessToken = await this.tokenService.createAccessToken(payload);
    const refreshToken = await this.tokenService.createRefreshToken(payload);

    const hashedRefreshToken = await BcryptUtil.hash(refreshToken);

    // Save refresh token
    await this.userService.saveRefreshToken(hashedRefreshToken, user.userUID);

    return {
      accessToken,
      refreshToken,
      user: plainToInstance(UserResponseDto, user, { excludeExtraneousValues: true }),
    };
  }

  async logout(userId: number): Promise<void> {
    await this.userService.saveRefreshToken(null, userId);
  }
}
