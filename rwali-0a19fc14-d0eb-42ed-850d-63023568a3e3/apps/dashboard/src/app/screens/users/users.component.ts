import { Component, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UsersService } from '../../shared/users.service';
import { OrgNode, Role } from '../../shared/models';
import { LoggingService } from '../../shared/logging.service';
import { OrgService } from '../../shared/org.service';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="max-w-4xl mx-auto p-4 space-y-4">
      <div *ngIf="org()" class="text-xs text-gray-500">
        Org: {{ org()!.name }}
        <span *ngIf="org()!.parent">
          (child of {{ org()!.parent!.name }})
        </span>
      </div>

      <div class="flex items-center gap-3">
        <h1 class="text-2xl font-semibold">Users</h1>
        <span class="text-sm text-gray-500">(Org members)</span>
      </div>

      <form (ngSubmit)="create()" class="bg-white dark:bg-gray-800 border rounded-xl p-3 flex flex-wrap gap-2">
        <input [(ngModel)]="email" name="email" type="email" placeholder="Email" required
          class="flex-1 min-w-[150px] rounded border px-3 py-2 bg-transparent" />
        <input [(ngModel)]="password" name="password" type="password" placeholder="Temp password" required
          class="flex-1 min-w-[120px] rounded border px-3 py-2 bg-transparent" />
        <select [(ngModel)]="role" name="role" class="rounded border px-2 py-2 bg-transparent">
          <option [ngValue]="'viewer'">Viewer</option>
          <option [ngValue]="'admin'">Admin</option>
          <option [ngValue]="'owner'">Owner</option>
        </select>
        <button class="px-3 py-2 rounded bg-black text-white dark:bg-white dark:text-black">
          Add User
        </button>
      </form>

      <table class="w-full text-sm border-collapse">
        <thead>
          <tr class="border-b text-left text-xs text-gray-500">
            <th class="py-2">Email</th>
            <th class="py-2">Role</th>
            <th class="py-2">Org</th>
            <th class="py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr *ngFor="let u of usersSvc.users()" class="border-b last:border-0">
            <td class="py-2">{{ u.email }}</td>
            <td class="py-2">
              <select [ngModel]="u.role" (ngModelChange)="changeRole(u.id, $event)" class="rounded border px-1 py-1 bg-transparent text-xs">
                <option [ngValue]="'viewer'">viewer</option>
                <option [ngValue]="'admin'">admin</option>
                <option [ngValue]="'owner'">owner</option>
              </select>
            </td>
            <td class="py-2 text-xs text-gray-500">
              {{ u.orgName || u.orgId || '—' }}
            </td>
            <td class="py-2 text-xs text-gray-500">
              <!-- Future actions (disable, invite, etc.) -->
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  `,
})
export class UsersComponent {
  email = '';
  password = '';
  role: Role = 'viewer';
  org = signal<OrgNode | null>(null);

  constructor(public usersSvc: UsersService, private log: LoggingService,private orgSvc: OrgService) {
    this.usersSvc.fetch();
    this.orgSvc.getTree().subscribe(tree => this.org.set(tree));
  }

  create() {
    this.usersSvc.create({
      email: this.email,
      password: this.password,
      role: this.role,
    }).subscribe(user => {
      this.usersSvc.users.set([...this.usersSvc.users(), user]);
      this.log.log('user:create', `Created user ${user.email} (${user.role})`);
      this.email = '';
      this.password = '';
      this.role = 'viewer';
    });
  }

  changeRole(id: string, role: Role) {
    this.usersSvc.updateRole(id, { role }).subscribe(user => {
      this.usersSvc.users.set(
        this.usersSvc.users().map(u => u.id === user.id ? user : u),
      );
      this.log.log('user:role', `Changed role of ${user.email} to ${user.role}`);
    });
  }
}
