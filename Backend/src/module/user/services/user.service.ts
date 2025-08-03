import { Injectable, NotFoundException } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { FullUserResponseDto, UserResponseDto } from '../dtos/user.response.dto';
import { plainToInstance } from 'class-transformer';
import { CreateUserRequestDto } from '../dtos/create-user.request.dto';
import { RoleService } from 'src/module/role/services/role.service';

@Injectable()
export class UserService {
  constructor(
    private readonly dataSource: DataSource,
    private readonly roleService: RoleService,
  ) {}

  async findUserById(userId: number): Promise<FullUserResponseDto | null> {
    const result = await this.dataSource.query(
      `
    SELECT 
      u.UserUID AS userUID,
      u.RoleFID AS roleFID,
      r.RoleName AS roleName,
      u.Name AS name,
      u.Username AS username,
      u.Email AS email,
      u.PhoneNumber AS phone,
      u.HashedPassword AS hashedPassword,
      u.RefreshToken AS refreshToken
    FROM [user] u
    LEFT JOIN role r ON u.RoleFID = r.RoleUID
    WHERE u.UserUID = @0
    `,
      [userId],
    );
    if (!result || result.length === 0) {
      return null;
    }

    return plainToInstance(FullUserResponseDto, result[0]);
  }

  async findUserByUsername(username: string): Promise<FullUserResponseDto | null> {
    const result = await this.dataSource.query(
      `
    SELECT 
      u.UserUID AS userUID,
      u.RoleFID AS roleFID,
      r.RoleName AS roleName,
      u.Name AS name,
      u.Username AS username,
      u.Email AS email,
      u.PhoneNumber AS phone,
      u.RefreshToken AS refreshToken,
      u.HashedPassword AS hashedPassword
    FROM [user] u
    LEFT JOIN role r ON u.RoleFID = r.RoleUID
    WHERE u.Username = @0
    `,
      [username],
    );
    if (!result || result.length === 0) {
      return null;
    }

    return plainToInstance(FullUserResponseDto, result[0]);
  }

  async createUser(user: CreateUserRequestDto): Promise<UserResponseDto> {
    // Find role ID
    // Auto assign default role for registered user
    let roleFID: number = 5;
    if (user.roleName) {
      roleFID = await this.roleService.findRoleUIDByName(user.roleName);
    }

    const result = await this.dataSource.query(
      `
      INSERT INTO [user] 
        (RoleFID, Name, Username, HashedPassword, Email, PhoneNumber)
      OUTPUT inserted.*
      VALUES 
        (@0, @1, @2, @3, @4, @5)
      `,
      [roleFID, user.name ?? null, user.username, user.hashedPassword, user.email ?? null, user.phone ?? null],
    );

    return plainToInstance(UserResponseDto, result[0]);
  }

  async getAllUsers(): Promise<FullUserResponseDto[]> {
    const results = await this.dataSource.query(
      `
    SELECT 
      u.UserUID AS userUID,
      u.RoleFID AS roleFID,
      r.RoleName AS roleName,
      u.Name AS name,
      u.Username AS username,
      u.Email AS email,
      u.PhoneNumber AS phone,
      u.RefreshToken AS refreshToken,
      u.HashedPassword AS hashedPassword
    FROM [user] u
    LEFT JOIN role r ON u.RoleFID = r.RoleUID
    `,
    );
    if (!results || results.length === 0) {
      return null;
    }

    return results.map((result) => plainToInstance(FullUserResponseDto, result));
  }

  async saveRefreshToken(refreshToken: string, userUID: number) {
    return this.dataSource.query(`UPDATE [user] SET RefreshToken = @0 WHERE UserUID = @1`, [refreshToken, userUID]);
  }
}
