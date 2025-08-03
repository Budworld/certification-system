// src/certificate/entities/certificate.entity.ts
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'certificate', schema: 'dbo', database: 'QL_TRUNG_TAM' })
export class Certificate {
  @PrimaryGeneratedColumn({ name: 'CertificateUID' })
  certificateUID: number;

  @Column({ name: 'Status' })
  status: string;

  @Column({ name: 'CertificateName' })
  certificateName: string;

  @Column({ name: 'Content' })
  content: string;

  @Column({ name: 'RegistrationDetailFID' })
  registrationDetailFID: number;
}
