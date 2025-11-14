export * from './lib/data';


// Roles with inheritance: Owner > Admin > Viewer
export enum Role {
  Viewer = 'viewer',
  Admin = 'admin',
  Owner = 'owner',
}

export enum Permission {
  TASK_CREATE = 'task:create',
  TASK_READ   = 'task:read',
  TASK_UPDATE = 'task:update',
  TASK_DELETE = 'task:delete',
  AUDIT_READ  = 'audit:read',
}

export interface LoginDto {
  email: string;
  password: string;
}

export interface RegisterDto {
  email: string;
  password: string;
  orgId?: string; // optional assign
  role?: Role;
}

export interface TaskDto {
  title: string;
  description?: string;
  // implicitly scoped by org + user on server
}

export interface Task extends TaskDto {
  id: string;
  orgId: string;
  ownerId: string;
  createdAt: string;
  updatedAt: string;
}

export interface JwtUser {
  id: string;
  email: string;
  orgId: string | null;
  role: Role;
}


export interface UserSummary {
  id: string;
  email: string;
  role: Role;
  orgId: string | null;
  orgName?: string;
}

export interface CreateUserDto {
  email: string;
  password: string;
  role: Role;
  orgId?: string;
}

export interface UpdateUserRoleDto {
  role: Role;
}
