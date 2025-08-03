export interface CreateUserRequestDto {
  roleName?: string | null;
  name?: string;
  username: string;
  hashedPassword: string;
  email?: string;
  phone?: string;
}
