import { Module } from '@nestjs/common';
import { EmailService } from './services/email.service';

@Module({
  providers: [EmailService],
  exports: [EmailService], // 👈 xuất để module khác sử dụng
})
export class EmailModule {}
