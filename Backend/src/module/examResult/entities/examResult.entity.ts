import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';

@Entity('exam_result')
export class ExamResult {
  @PrimaryGeneratedColumn({ name: 'ExamResultUID' })
  id: number;

  @Column({ name: 'Status' })
  status: string;

  @Column({ name: 'Content' })
  content: string;

  @Column({ name: 'Score' })
  score: number;

  @Column({ name: 'RegistrationDetailFID' })
  registrationDetailId: number;
}
