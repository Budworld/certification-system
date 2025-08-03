import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'user' })
export class User extends BaseEntity {
  @PrimaryGeneratedColumn({ name: 'UserUID' })
  userUID?: string;

  @Column({ name: 'RoleFID', nullable: true })
  roleFID: string;

  @Column({ name: 'Name', length: 50, nullable: true })
  name?: string;

  @Column({ name: 'Username', nullable: false, unique: true })
  username: string;

  @Column({ name: 'HashedPassword', nullable: false })
  hashedPassword: string;

  @Column({ name: 'Email', nullable: true })
  email?: string;

  @Column({ name: 'PhoneNumber', length: 20, nullable: true })
  phone?: string;

  @Column({ name: 'RefreshToken' })
  refreshToken?: string;
}
