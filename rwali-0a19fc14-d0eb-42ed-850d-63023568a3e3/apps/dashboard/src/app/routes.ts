import { Routes } from '@angular/router';
import { LoginComponent } from './screens/login/login.component';
import { TasksComponent } from './screens/tasks/tasks.component';
import { authGuard } from './shared/auth.guard';
import { UsersComponent } from './screens/users/users.component';


export const routes: Routes = [
{ path: 'login', component: LoginComponent },
{ path: '', pathMatch: 'full', redirectTo: 'tasks' },
{ path: 'tasks', component: TasksComponent, canActivate: [authGuard] },
{ path: 'users', component: UsersComponent, canActivate: [authGuard] },
{ path: '**', redirectTo: 'tasks' },
];
