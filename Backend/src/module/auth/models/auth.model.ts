export interface LoggedUser {
  id: string;
  role?: LoggedRole;
}

export interface LoggedPermission {
  id: string;
  key?: string;
  name?: string;
  feature?: string;
  function?: string;
}

export interface LoggedRole {
  id: string;
  name: string;
  description: string;
  readonly: boolean;
  permissions?: LoggedPermission[];
}
