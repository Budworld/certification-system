import { Injectable } from '@nestjs/common';

@Injectable()
export class EmailService {
  async sendResultNotification(candidateNumber: string, examName: string | null, score: number) {
    console.log(
      `[EMAIL] Thông báo Candidate ${candidateNumber}: ` +
      `Kết quả = ${score}. ${examName ? 'Đã tạo chứng chỉ: ' + examName : 'Không đạt.'}`
    );
    // Sau này bạn cấu hình nodemailer ở đây.
  }
}
