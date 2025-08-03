import { Body, Controller, HttpCode, HttpStatus, Post, Req, UseGuards, Get, Logger, Request } from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { TokenService } from '../services/token.service';
import { RegisterRequestDto } from '../dtos/register.request.dto';
import { LoginRequestDto } from '../dtos/login.request.dto';
import { AuthGuard } from '../guards/auth.guard';
import { ResponseMessage } from 'src/common/decorators/response-message.decorator';
import { TokenUtils } from 'src/utils';

@Controller('auth')
export class AuthController {
  private readonly logger = new Logger(AuthController.name);
  constructor(
    private readonly authService: AuthService,
    private readonly tokenService: TokenService,
  ) {}

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  @ResponseMessage('User registered successfully')
  async register(@Body() dto: RegisterRequestDto) {
    await this.authService.register(dto);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ResponseMessage('User login successfully')
  async login(@Body() dto: LoginRequestDto) {
    this.logger.debug('Login info: username: ' + dto.username + ', password: ' + dto.password);
    return await this.authService.login(dto);
  }

  @Post('logout')
  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  async logout(@Req() req: Request) {
    const user = req['user'];
    // await this.authService.logout(user.sub);
  }

  @Post('refresh-token')
  @HttpCode(HttpStatus.OK)
  async refreshToken(@Body('refreshToken') refreshToken: string, @Req() request: Request) {
    this.logger.debug('Request authorization header: ' + request.headers['authorization']);
    const accessToken = TokenUtils.extractTokenFromHeader(request.headers['authorization']);

    return await this.tokenService.refreshAccessToken(accessToken, refreshToken);
  }
}
