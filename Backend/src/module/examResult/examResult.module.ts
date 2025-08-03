import { Module } from '@nestjs/common';
import { ExamResultController } from './controllers/examResult.controller';
import { ExamResultService } from './services/examResult.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EmailModule } from '../email/email.module'; // 👈 Thêm dòng này

@Module({
  imports: [
    TypeOrmModule.forFeature([]), // Không cần entity nếu chỉ dùng query
    EmailModule, // 👈 Thêm module email
  ],
  controllers: [ExamResultController],
  providers: [ExamResultService],
  exports: [ExamResultService],
})
export class ExamResultModule {}
