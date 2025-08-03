import { BaseEntity, Column, Entity } from 'typeorm';

@Entity({ name: 'permission_category' })
export class PrivilegeCategory extends BaseEntity {
  @Column({ name: 'CategoryUID', primary: true, unique: true })
  categoryUid: number;

  @Column({ name: 'CategoryName', length: 35 })
  categoryName: string;

  @Column({ name: 'Description', length: 50, nullable: true })
  description: string;
}
