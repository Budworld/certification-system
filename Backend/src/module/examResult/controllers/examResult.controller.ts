import { 
  Controller, 
  Post, 
  Body, 
  UploadedFile, 
  UseInterceptors 
} from '@nestjs/common';
import { ExamResultService } from '../services/examResult.service';
import { CreateExamResultDto } from '../dtos/createExamResult.dto';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('exam-result')
export class ExamResultController {
  constructor(private readonly examResultService: ExamResultService) {}

  @Post('manual')
  async insertManual(@Body() dto: CreateExamResultDto) {
    // Gọi insertOne (bây giờ tự lookup RegistrationDetailFID)
    const result = await this.examResultService.insertOne(dto);
    return { message: 'Ghi nhận kết quả thành công', data: result };
  }

  @Post('import')
  @UseInterceptors(FileInterceptor('file'))
  async importCsv(@UploadedFile() file: Express.Multer.File) {
    const result = await this.examResultService.importFromCSV(file.buffer);
    return { message: 'Import file CSV thành công', data: result };
  }
}
