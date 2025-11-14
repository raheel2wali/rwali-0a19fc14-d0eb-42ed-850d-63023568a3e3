export type Role = 'viewer' | 'admin' | 'owner';


export interface JwtUser {
id: string; email: string; orgId: string | null; role: Role;
}


export interface AuthResponse { token: string; user: JwtUser; }


export interface TaskDto {
title: string; description?: string; category?: 'Work'|'Personal'|'Other'; status?: 'todo'|'inprogress'|'done';
}


export interface Task extends TaskDto {
id: string; orgId: string; ownerId?: string; createdAt: string; updatedAt: string;
}

export interface UserSummary {
  id: string; email: string; role: Role; orgId: string | null; orgName?: string;
}

export interface CreateUserDto {
  email: string; password: string; role: Role; orgId?: string;
}

export interface UpdateUserRoleDto {
  role: Role;
}

export interface OrgNode {
  id: string; name: string; parent?: OrgNode | null; children?: OrgNode[];
}
