import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { AuthResponse } from './models';
import { LoggingService } from './logging.service';


@Injectable({ providedIn: 'root' })
export class AuthService {
  user = signal<AuthResponse['user'] | null>(null);


  constructor(private http: HttpClient , private logger: LoggingService) {
    const token = localStorage.getItem('jwt');
    const user = localStorage.getItem('user');
    if (token && user) this.user.set(JSON.parse(user));
  }


  login(email: string, password: string) {
    return this.http.post<AuthResponse>(`${environment.apiUrl}/auth/login`, { email, password });
  }


  setSession(res: AuthResponse) {
    localStorage.setItem('jwt', res.token);
    localStorage.setItem('user', JSON.stringify(res.user));
    this.user.set(res.user);
    this.logger.log('auth:login', `Logged in as ${res.user.email} (${res.user.role})`);
  }


  logout() {
    localStorage.removeItem('jwt');
    localStorage.removeItem('user');
    this.user.set(null);
    this.logger.log('auth:logout', 'User logged out');
    location.href = '/login';
  }


  isAuthed() { return !!localStorage.getItem('jwt'); }
}
