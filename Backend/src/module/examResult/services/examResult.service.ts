import {
  Injectable,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { DataSource } from 'typeorm';
import { CreateExamResultDto } from '../dtos/createExamResult.dto';
import * as csvParser from 'csv-parser';
import * as stream from 'stream';
import { EmailService } from '../../email/services/email.service'; // ví dụ import EmailService

@Injectable()
export class ExamResultService {
  constructor(
    private readonly dataSource: DataSource,
    private readonly emailService: EmailService, // Inject EmailService
  ) {}

  async insertOne(dto: CreateExamResultDto): Promise<any> {
    // Tìm RegistrationDetail
    const reg = await this.dataSource.query(
      `
      SELECT TOP 1 ID, CandidateFID
      FROM [registration_detail]
      WHERE CandidateNumber = @0 AND ExamScheduleFID = @1
      `,
      [dto.candidateNumber, dto.examScheduleUID],
    );

    if (!reg[0]) {
      throw new NotFoundException(
        `Không tìm thấy RegistrationDetail cho CandidateNumber ${dto.candidateNumber}`,
      );
    }

    const regID = reg[0].ID;

    // Ghi kết quả thi
    const result = await this.dataSource.query(
      `
      INSERT INTO [exam_result] (Status, Content, Score, RegistrationDetailFID)
      OUTPUT INSERTED.*
      VALUES (@0, @1, @2, @3)
      `,
      [dto.status, dto.content ?? null, dto.score, regID],
    );

    // Nếu Passed, tạo chứng chỉ
    let createdCertificate = null;
    if (dto.status.toLowerCase() === 'passed') {
      const examNameRes = await this.dataSource.query(
        `
        SELECT et.ExamName
        FROM exam_schedule es
        JOIN exam_type et ON es.ExamTypeFID = et.ExamTypeUID
        WHERE es.ExamTypeFID = @0
        `,
        [dto.examScheduleUID],
      );

      const examName = examNameRes[0]?.ExamName ?? 'Chứng chỉ';

      await this.dataSource.query(
        `
        INSERT INTO [certificate] (Status, CertificateName, Content, RegistrationDetailFID)
        VALUES (@0, @1, @2, @3)
        `,
        ['Processing', examName, 'Certificate generation in progress.'	, regID],
      );

      createdCertificate = examName;

      // Gửi email thông báo đậu + thời gian nhận chứng chỉ
      await this.emailService.sendResultNotification(
        dto.candidateNumber,
        examName,
        dto.score,
      );
    } else {
      // Gửi email thông báo không đạt
      await this.emailService.sendResultNotification(
        dto.candidateNumber,
        null,
        dto.score,
      );
    }

    return {
      ...result[0],
      certificateCreated: createdCertificate ? true : false,
    };
  }

  async importFromCSV(fileBuffer: Buffer): Promise<any[]> {
    const rows: CreateExamResultDto[] = [];
    const bufferStream = new stream.PassThrough();
    bufferStream.end(fileBuffer);

    return new Promise((resolve, reject) => {
      bufferStream
        .pipe(csvParser())
        .on('data', (row) => {
          rows.push({
            candidateNumber: row.CandidateNumber,
            examScheduleUID: Number(row.ExamScheduleUID),
            score: Number(row.Score),
            status: row.Status,
            content: null, // luôn null
          });
        })
        .on('end', async () => {
          try {
            const inserted: any[] = [];
            for (const row of rows) {
              const res = await this.insertOne(row);
              inserted.push(res);
            }
            resolve(inserted);
          } catch (error) {
            reject(error);
          }
        })
        .on('error', (err) => reject(err));
    });
  }
}
