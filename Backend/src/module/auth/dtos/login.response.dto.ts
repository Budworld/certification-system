import { UserResponseDto } from 'src/module/user/dtos/user.response.dto';

export class LoginResponseDto {
  user: UserResponseDto;
  accessToken: string;
  refreshToken?: string;
}
