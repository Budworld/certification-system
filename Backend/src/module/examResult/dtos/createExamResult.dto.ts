import { IsString, IsNumber, IsOptional } from 'class-validator';

export class CreateExamResultDto {
  @IsString()
  candidateNumber: string;

  @IsNumber()
  examScheduleUID: number;

  @IsString()
  status: string;

  @IsOptional()
  @IsString()
  content?: string;

  @IsNumber()
  score: number;
}
