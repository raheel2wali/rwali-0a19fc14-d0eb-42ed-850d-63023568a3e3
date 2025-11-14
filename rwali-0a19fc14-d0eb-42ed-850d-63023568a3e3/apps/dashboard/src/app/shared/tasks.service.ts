import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Task, TaskDto } from './models';


@Injectable({ providedIn: 'root' })
export class TasksService {
  tasks = signal<Task[]>([]);
  loading = signal(false);


  constructor(private http: HttpClient) { }


  fetch() {
    this.loading.set(true);
    this.http.get<Task[]>(`${environment.apiUrl}/tasks`).subscribe({
      next: (res) => { this.tasks.set(res); this.loading.set(false); },
      error: () => this.loading.set(false)
    });
  }


  create(dto: TaskDto) {
    return this.http.post<Task>(`${environment.apiUrl}/tasks`, dto);
  }


  update(id: string, dto: TaskDto) {
    return this.http.put<Task>(`${environment.apiUrl}/tasks/${id}`, dto);
  }


  remove(id: string) {
    return this.http.delete<{ ok: boolean }>(`${environment.apiUrl}/tasks/${id}`);
  }
}
