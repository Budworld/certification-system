import { IsNotEmpty, IsString, IsNumber, IsOptional } from 'class-validator';

export class CreateCertificateDto {
  @IsString()
  @IsNotEmpty()
  status: string; // VD: Chưa cấp

  @IsString()
  @IsNotEmpty()
  certificateName: string;

  @IsString()
  @IsOptional()
  content?: string;

  @IsNumber()
  registrationDetailFID: number;
}
