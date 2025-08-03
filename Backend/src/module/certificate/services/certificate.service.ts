import {
  Injectable,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { DataSource } from 'typeorm';
import { plainToInstance } from 'class-transformer';
import { CertificateDto } from '../dtos/certificate.dto';
import { CreateCertificateDto } from '../dtos/CreateCertificate.dto';
import { UpdateCertificateDto } from '../dtos/UpdateCertificate.dto';
import { createTransport } from 'nodemailer';
import { Express } from 'express';
@Injectable()
export class CertificateService {
  constructor(private readonly dataSource: DataSource) {}

  async getAll(): Promise<CertificateDto[]> {
    const results = await this.dataSource.query(`
      SELECT
        ExamScheduleFID AS examScheduleUID,
        CandidateNumber AS candidateNumber,
        CertificateName AS certificateName,
        [certificate].Status AS status,
        [certificate].Content AS content,
        CertificateUID AS certificateUID,
        Score as score,
        Name as candidateName
      FROM [certificate]
      JOIN [registration_detail] ON [certificate].RegistrationDetailFID = [registration_detail].ID
      JOIN [exam_result] ON [registration_detail].ID = [exam_result].RegistrationDetailFID
      JOIN [candidate] ON [registration_detail].CandidateFID = [candidate].CandidateUID
      ORDER BY CertificateUID DESC
      OFFSET 0 ROWS
      
    `);

    return results.map(r => plainToInstance(CertificateDto, r));
  }
  
  async searchCandidateNumber(examScheduleUID: number, query: string): Promise<CertificateDto[]> {
  const result = await this.dataSource.query(
    `
    SELECT
      ExamScheduleFID AS examScheduleUID,
      rd.CandidateNumber AS candidateNumber,
      cert.CertificateName AS certificateName,
      cert.Status AS status,
      cert.Content AS content,
      cert.CertificateUID AS certificateUID,
      er.Score AS score,
      ca.Name AS candidateName
    FROM [certificate] cert
    JOIN [registration_detail] rd ON cert.RegistrationDetailFID = rd.ID
    JOIN [exam_result] er ON rd.ID = er.RegistrationDetailFID
    JOIN [candidate] ca ON rd.CandidateFID = ca.CandidateUID
    WHERE rd.ExamScheduleFID = @0
      AND rd.CandidateNumber LIKE '%' + @1 + '%'
    ORDER BY cert.CertificateUID DESC
    `,
    [examScheduleUID, query],
  );

  return result.map(r => plainToInstance(CertificateDto, r));
}



  async insertOne(dto: CreateCertificateDto): Promise<CertificateDto> {
    try {
      const result = await this.dataSource.query(
        `
        INSERT INTO [certificate] (Status, CertificateName, Content, RegistrationDetailFID)
        OUTPUT INSERTED.CertificateUID, INSERTED.Status, INSERTED.CertificateName, INSERTED.Content, INSERTED.RegistrationDetailFID
        VALUES (@0, @1, @2, @3)
        `,
        [dto.status, dto.certificateName, dto.content, dto.registrationDetailFID],
      );

      return plainToInstance(CertificateDto, result[0]);
    } catch (error) {
      throw new InternalServerErrorException('Failed to insert certificate');
    }
  }


  async updateStatusWhenPrinted(id: number): Promise<void> {
    // 1. Lấy tên thí sinh tương ứng
    const certInfo = await this.dataSource.query(
      `
      SELECT c.CertificateUID, ca.Name AS candidateName
      FROM [certificate] c
      JOIN [registration_detail] rd ON c.RegistrationDetailFID = rd.ID
      JOIN [candidate] ca ON rd.CandidateFID = ca.CandidateUID
      WHERE c.CertificateUID = @0
      `,
      [id]
    );

    if (!certInfo.length) {
      throw new NotFoundException(`Certificate with ID ${id} not found`);
    }

    const candidateName = certInfo[0].candidateName;

    // 2. Cập nhật status và content
    await this.dataSource.query(
      `
      UPDATE [certificate]
      SET Status = 'PRINTED',
          Content = @1
      WHERE CertificateUID = @0
      `,
      [id, `Certificate has been printed successfully for ${candidateName}`]
    );
  }

  // certificate.service.ts
  async markReadyForPickup(id: number) {
    const result = await this.dataSource.query(
      `
      UPDATE [certificate]
      SET 
        Status = 'READY FOR PICKUP',
        Content = CONCAT(
          'This is to certify that ', c.Name,
          ' has achieved a score of ', er.Score,
          ' in the ', cert.CertificateName, ' test'
        )
      FROM [certificate] cert
      JOIN [registration_detail] rd ON cert.RegistrationDetailFID = rd.ID
      JOIN [candidate] c ON rd.CandidateFID = c.CandidateUID
      JOIN [exam_result] er ON rd.ID = er.RegistrationDetailFID
      WHERE cert.CertificateUID = @0
      `,
      [id]
    );

    return { success: true, certificateUID: id };
  }


    async sendCertificateEmail(
    certificateUID: number,
    pdfFile: Express.Multer.File,
  ) {
      console.log(`📨 [START] Gửi email cho chứng chỉ ID = ${certificateUID}`);

    // Tìm email từ database
    const result = await this.dataSource.query(
      `
      SELECT c.CertificateUID, cand.Email
      FROM [certificate] c
      JOIN [registration_detail] rd ON c.RegistrationDetailFID = rd.ID
      JOIN [candidate] cand ON rd.CandidateFID = cand.CandidateUID
      WHERE c.CertificateUID = @0
      `,
      [certificateUID],
    );

    if (!result.length || !result[0].Email) {
      throw new NotFoundException('Không tìm thấy email ứng với certificate này');
    }
    console.log(`📧 Email tìm thấy: ${result[0].Email}`);
    const email = result[0].Email;
    // Gửi email
    const transporter = createTransport({
      service: 'gmail',
      auth: {
        user: 'your email',
        pass: 'your password',
      },
    });
    console.log('📄 Thông tin PDF nhận được từ FE:');
    console.log('Tên file:', pdfFile.originalname);
    console.log('Mimetype:', pdfFile.mimetype);
    console.log('Kích thước (bytes):', pdfFile.size);
    console.log('Loại buffer:', typeof pdfFile.buffer);
    console.log('Buffer slice:', pdfFile.buffer?.toString('base64').slice(0, 100) + '...'); // log 100 ký tự đầu
   try {
      const info = await transporter.sendMail({
        from: 'your email',
        to: email,
        subject: 'Thông báo kết quả kỳ thi và chứng chỉ',
        text: `Xin chào,

    Bạn đã hoàn thành kỳ thi và đạt được chứng chỉ.

    Vui lòng xem file PDF đính kèm để biết chi tiết chứng chỉ.

    Trân trọng,
    Trung tâm Khảo thí Quốc gia`,
        attachments: [
          {
            filename: pdfFile.originalname || `certificate_${certificateUID}.pdf`,
            content: pdfFile.buffer,
            contentType: pdfFile.mimetype || 'application/pdf',
          },
        ],
      });

      console.log(`✅ Gửi mail thành công tới ${email.trim()}, messageId: ${info.messageId}`);
    } catch (err) {
      console.error('❌ Gửi mail thất bại:', err);
      throw new InternalServerErrorException('Lỗi gửi email');
    }




    return { message: `✅ Email sent to ${email}` };
  }

  async issueCertificate(id: number) {
  // 1. Lấy tên thí sinh
  const certInfo = await this.dataSource.query(
    `
    SELECT c.CertificateUID, ca.Name AS candidateName
    FROM [certificate] c
    JOIN [registration_detail] rd ON c.RegistrationDetailFID = rd.ID
    JOIN [candidate] ca ON rd.CandidateFID = ca.CandidateUID
    WHERE c.CertificateUID = @0
    `,
    [id]
  );

  if (!certInfo.length) {
    throw new NotFoundException(`Certificate with ID ${id} not found`);
  }

  const candidateName = certInfo[0].candidateName;

  // 2. Cập nhật status và content
  await this.dataSource.query(
    `
    UPDATE [certificate]
    SET Status = 'ISSUED',
        Content = @1
    WHERE CertificateUID = @0
    `,
    [id, `Successfully issued for ${candidateName}`]
  );

  return { message: `Certificate ${id} issued for ${candidateName}` };
}

}
