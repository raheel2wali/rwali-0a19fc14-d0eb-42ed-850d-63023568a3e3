import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../shared/auth.service';


@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
          <div class="min-h-[80vh] flex items-center justify-center">
          <div class="w-full max-w-sm bg-white dark:bg-gray-800 rounded-2xl shadow p-6 space-y-4">
          <h1 class="text-xl font-semibold">Sign in</h1>
          <form (ngSubmit)="submit()" class="space-y-3">
          <div>
          <label class="text-sm">Email</label>
          <input [(ngModel)]="email" name="email" type="email" required class="mt-1 w-full rounded border px-3 py-2 bg-transparent" />
          </div>
          <div>
          <label class="text-sm">Password</label>
          <input [(ngModel)]="password" name="password" type="password" required class="mt-1 w-full rounded border px-3 py-2 bg-transparent" />
          </div>
          <button class="w-full py-2 rounded bg-black text-white dark:bg-white dark:text-black">Login</button>
          </form>
          <p *ngIf="err" class="text-sm text-red-600">{{err}}</p>
          </div>
          </div>
          `,
})
export class LoginComponent {
  email = '';
  password = '';
  err = '';
  constructor(private auth: AuthService, private router: Router) { }


  submit() {
    this.err = '';
    this.auth.login(this.email, this.password).subscribe({
      next: (res) => { this.auth.setSession(res); this.router.navigateByUrl('/tasks'); },
      error: (e) => { this.err = e?.error?.message || 'Login failed'; }
    });
  }
}
