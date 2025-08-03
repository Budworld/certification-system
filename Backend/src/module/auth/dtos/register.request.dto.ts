import { IsEmail, IsNotEmpty, IsOptional, Length, Matches, MinLength } from 'class-validator';

export class RegisterRequestDto {
  @IsNotEmpty()
  username: string;

  @MinLength(8)
  @IsNotEmpty()
  password: string;

  @IsOptional()
  @Length(1, 50)
  name?: string;

  @IsOptional()
  @IsEmail()
  @Length(1, 50)
  email?: string;

  @IsOptional()
  @Matches(/^[0-9\-+()\s]{7,20}$/, { message: 'Invalid phone number format' })
  phone?: string;

  @IsOptional()
  roleName?: string;
}
