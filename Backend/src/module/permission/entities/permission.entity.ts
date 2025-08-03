import { booleanColumn } from 'src/utils';
import { BaseEntity, Column, Entity } from 'typeorm';

@Entity({ name: 'ent_privilege' })
export class Privilege extends BaseEntity {
  @Column({ name: 'PermName', length: 25, primary: true })
  permissionName: string;

  @Column({ name: 'CategoryFID' })
  categoryFid: number;

  @Column({ name: 'Description', length: 50 })
  description: string;

  @Column(booleanColumn('PermCreate'))
  permissionCreate: boolean;

  @Column(booleanColumn('PermRead'))
  permissionRead: boolean;

  @Column(booleanColumn('PermUpdate'))
  permissionUpdate: boolean;

  @Column(booleanColumn('PermDelete'))
  permissionDelete: boolean;
}
