import { Controller, Get, Logger, UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/module/auth';
import { UserResponseDto } from '../dtos/user.response.dto';
import { UserService } from '../services/user.service';
import { ResponseMessage } from 'src/common';

@Controller('users')
@UseGuards(AuthGuard)
export class UserController {
  private readonly logger = new Logger(UserController.name);
  constructor(private readonly userService: UserService) {}

  @Get()
  @ResponseMessage('Get all users successfully')
  async getAllUsers(): Promise<UserResponseDto[]> {
    return await this.userService.getAllUsers();
  }
}
