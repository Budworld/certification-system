import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class ImportExamResultCsvRowDto {
  @IsString()
  @IsNotEmpty()
  candidateNumber: string;

  @IsNumber()
  examScheduleUID: number;

  @IsNumber()
  score: number;

  @IsString()
  @IsNotEmpty()
  status: string; // Passed / Failed
}
