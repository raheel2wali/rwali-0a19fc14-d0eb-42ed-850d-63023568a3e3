import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { UserSummary, CreateUserDto, UpdateUserRoleDto, Role } from './models';

@Injectable({ providedIn: 'root' })
export class UsersService {
  users = signal<UserSummary[]>([]);
  loading = signal(false);

  constructor(private http: HttpClient) {}

  fetch() {
    this.loading.set(true);
    this.http.get<UserSummary[]>(`${environment.apiUrl}/users`).subscribe({
      next: (res) => { this.users.set(res); this.loading.set(false); },
      error: () => this.loading.set(false),
    });
  }

  create(dto: CreateUserDto) {
    return this.http.post<UserSummary>(`${environment.apiUrl}/users`, dto);
  }

  updateRole(id: string, dto: UpdateUserRoleDto) {
    return this.http.put<UserSummary>(`${environment.apiUrl}/users/${id}/role`, dto);
  }
}
