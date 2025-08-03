import { Expose } from 'class-transformer';

export class UserResponseDto {
  @Expose()
  userUID: number;

  @Expose()
  roleFID: number | null;

  @Expose()
  roleName: string | null;

  @Expose()
  name?: string;

  @Expose()
  username: string;

  @Expose()
  email?: string;

  @Expose()
  phone?: string;
}

export class FullUserResponseDto extends UserResponseDto {
  refreshToken?: string;
  hashedPassword?: string;
}
