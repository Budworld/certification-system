import { Injectable, NotFoundException } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { Role } from '../entities/role.entity';

@Injectable()
export class RoleService {
  constructor(private readonly dataSource: DataSource) {}
  async findRoleUIDByName(roleName: string): Promise<number> {
    const result = await this.dataSource.query(`SELECT RoleUID FROM role WHERE RoleName = @0`, [roleName]);

    if (result.length === 0) {
      throw new NotFoundException(`Role '${roleName}' not found`);
    }

    return result[0].RoleUID;
  }
}
