import { Component, effect, signal } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { AuthService } from './shared/auth.service';
import { CommonModule } from '@angular/common';
import { LogPanelComponent } from './shared/log-panel.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,          // <-- REQUIRED for *ngIf
    RouterOutlet,
    RouterLink,
    LogPanelComponent,
  ],
  template: `
    <div class="min-h-screen flex flex-col">
      <header class="border-b bg-white/80 backdrop-blur sticky top-0 z-10 dark:bg-gray-800/60">
        <div class="max-w-6xl mx-auto px-4 py-3 flex items-center gap-4">
          <a class="font-semibold" routerLink="/tasks">TurboVets Dashboard</a>
          <div class="ml-auto flex items-center gap-3">

            <!-- Add Users link here -->
            <a
              class="text-sm underline cursor-pointer"
              routerLink="/users"
              *ngIf="auth.isAuthed()"
            >
              Users
            </a>

            <!-- THIS LINE needed CommonModule -->
            <button *ngIf="auth.isAuthed()" (click)="auth.logout()" class="px-2 py-1 rounded border text-sm">
              Logout
            </button>

          </div>
        </div>
      </header>

      <main class="flex-1">
        <router-outlet></router-outlet>
      </main>

      <!-- LOG PANEL HERE -->
      <app-log-panel></app-log-panel>
    </div>
  `,
})

export class AppComponent {
  theme = signal<'light' | 'dark'>(localStorage.getItem('theme') as any || 'light');
  constructor(public auth: AuthService) {
    effect(() => {
      const t = this.theme();
      const root = document.documentElement;
      if (t === 'dark') root.classList.add('dark'); else root.classList.remove('dark');
      localStorage.setItem('theme', t);
    });
  }
  toggleTheme() {
    this.theme.set(this.theme() === 'dark' ? 'light' : 'dark');
  }
}
