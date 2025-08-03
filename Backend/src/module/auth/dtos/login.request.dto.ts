import { IsNotEmpty, MinLength } from 'class-validator';

export class LoginRequestDto {
  @IsNotEmpty()
  username: string;

  @MinLength(8)
  @IsNotEmpty()
  password: string;
}
