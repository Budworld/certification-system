import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'role' })
export class Role extends BaseEntity {
  @PrimaryGeneratedColumn({ name: 'RoleUID' })
  roleUID: string;

  @Column({ name: 'RoleName', length: 20 })
  roleName: string;
}
