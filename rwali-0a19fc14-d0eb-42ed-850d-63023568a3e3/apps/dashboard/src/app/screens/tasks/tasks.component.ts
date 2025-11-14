import { Component, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  CdkDragDrop,
  DragDropModule,
  moveItemInArray,
  transferArrayItem,
} from '@angular/cdk/drag-drop';
import { TasksService } from '../../shared/tasks.service';
import { Task, TaskDto } from '../../shared/models';
import { LoggingService } from '../../shared/logging.service';

@Component({
  selector: 'app-tasks',
  standalone: true,
  imports: [CommonModule, FormsModule, DragDropModule],
  template: `
    <div class="max-w-6xl mx-auto p-4 space-y-4">
      <!-- Header + Filters -->
      <div class="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
        <div class="text-2xl font-semibold">Tasks</div>
        <div class="sm:ml-auto flex gap-2 items-center w-full sm:w-auto">
          <input
            [(ngModel)]="query"
            placeholder="Search…"
            class="w-full sm:w-64 rounded border px-3 py-2 bg-transparent"
          />
          <select
            [(ngModel)]="category"
            class="rounded border px-2 py-2 bg-transparent"
          >
            <option value="">All</option>
            <option>Work</option>
            <option>Personal</option>
            <option>Other</option>
          </select>
        </div>
      </div>

      <!-- Create Task -->
      <form
        (ngSubmit)="create()"
        class="bg-white dark:bg-gray-800 rounded-xl border p-3 flex gap-2 items-center"
      >
        <input
          [(ngModel)]="title"
          name="title"
          placeholder="New task title"
          required
          class="flex-1 rounded border px-3 py-2 bg-transparent"
        />
        <select
          [(ngModel)]="newCategory"
          name="category"
          class="rounded border px-2 py-2 bg-transparent"
        >
          <option>Work</option>
          <option>Personal</option>
          <option>Other</option>
        </select>
        <button
          class="px-3 py-2 rounded bg-black text-white dark:bg-white dark:text-black"
        >
          Add
        </button>
      </form>

      <!-- Columns -->
      <div class="grid md:grid-cols-3 gap-4">
        <!-- Todo -->
        <div
          class="rounded-xl border p-3 bg-white dark:bg-gray-800"
          cdkDropList
          [cdkDropListData]="todo()"
          (cdkDropListDropped)="drop($event, 'todo')"
        >
          <div class="font-medium mb-2">Todo</div>
          <div
            *ngFor="let t of todo()"
            class="rounded border p-2 mb-2 bg-gray-50 dark:bg-gray-900"
            cdkDrag
          >
            <div class="font-medium">{{ t.title }}</div>
            <div
              class="text-xs text-gray-500"
              *ngIf="t.description"
            >
              {{ t.description }}
            </div>
            <div class="mt-2 flex gap-2">
              <button
                type="button"
                (click)="edit(t)"
                class="text-xs underline"
              >
                Edit
              </button>
              <button
                type="button"
                (click)="del(t)"
                class="text-xs underline text-red-600"
              >
                Delete
              </button>
            </div>
          </div>
        </div>

        <!-- In Progress -->
        <div
          class="rounded-xl border p-3 bg-white dark:bg-gray-800"
          cdkDropList
          [cdkDropListData]="inprogress()"
          (cdkDropListDropped)="drop($event, 'inprogress')"
        >
          <div class="font-medium mb-2">In Progress</div>
          <div
            *ngFor="let t of inprogress()"
            class="rounded border p-2 mb-2 bg-gray-50 dark:bg-gray-900"
            cdkDrag
          >
            <div class="font-medium">{{ t.title }}</div>
            <div
              class="text-xs text-gray-500"
              *ngIf="t.description"
            >
              {{ t.description }}
            </div>
            <div class="mt-2 flex gap-2">
              <button
                type="button"
                (click)="edit(t)"
                class="text-xs underline"
              >
                Edit
              </button>
              <button
                type="button"
                (click)="del(t)"
                class="text-xs underline text-red-600"
              >
                Delete
              </button>
            </div>
          </div>
        </div>

        <!-- Done -->
        <div
          class="rounded-xl border p-3 bg-white dark:bg-gray-800"
          cdkDropList
          [cdkDropListData]="done()"
          (cdkDropListDropped)="drop($event, 'done')"
        >
          <div class="font-medium mb-2">Done</div>
          <div
            *ngFor="let t of done()"
            class="rounded border p-2 mb-2 bg-gray-50 dark:bg-gray-900"
            cdkDrag
          >
            <div class="font-medium">{{ t.title }}</div>
            <div
              class="text-xs text-gray-500"
              *ngIf="t.description"
            >
              {{ t.description }}
            </div>
            <div class="mt-2 flex gap-2">
              <button
                type="button"
                (click)="edit(t)"
                class="text-xs underline"
              >
                Edit
              </button>
              <button
                type="button"
                (click)="del(t)"
                class="text-xs underline text-red-600"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
})
export class TasksComponent {
  title = '';
  newCategory: 'Work' | 'Personal' | 'Other' = 'Work';
  query = '';
  category = '' as '' | 'Work' | 'Personal' | 'Other';

  constructor(public tasksSvc: TasksService, private log: LoggingService) {
    this.tasksSvc.fetch();
  }

  // Filtered list
  list = computed(() => {
    const q = this.query.toLowerCase();
    return this.tasksSvc.tasks().filter((t) => {
      const matchQ =
        !q ||
        t.title.toLowerCase().includes(q) ||
        (t.description || '').toLowerCase().includes(q);
      const matchC = !this.category || (t as any).category === this.category;
      return matchQ && matchC;
    });
  });

  // Columns
  todo = computed(() =>
    this.list().filter(
      (t) =>
        (t as any).status !== 'done' &&
        (t as any).status !== 'inprogress'
    ),
  );
  inprogress = computed(() =>
    this.list().filter((t) => (t as any).status === 'inprogress'),
  );
  done = computed(() =>
    this.list().filter((t) => (t as any).status === 'done'),
  );

  create() {
    const dto: TaskDto = {
      title: this.title,
      description: '',
      category: this.newCategory,
      status: 'todo',
    } as any;

    this.tasksSvc.create(dto).subscribe((t) => {
      this.tasksSvc.tasks.set([t, ...this.tasksSvc.tasks()]);
      this.log.log('task:create', `Created task "${t.title}"`);
      this.title = '';
    });
  }

  edit(t: Task) {
    const title = prompt('Edit title', t.title);
    if (title == null) return;

    const dto: TaskDto = { ...t, title } as any;
    this.tasksSvc.update(t.id, dto).subscribe((nt) => {
      this.tasksSvc.tasks.set(
        this.tasksSvc.tasks().map((x) => (x.id === t.id ? nt : x)),
      );
      this.log.log('task:update', `Updated task "${nt.title}"`);
    });
  }

  del(t: Task) {
    if (!confirm('Delete task?')) return;
    this.tasksSvc.remove(t.id).subscribe(() => {
      this.tasksSvc.tasks.set(
        this.tasksSvc.tasks().filter((x) => x.id !== t.id),
      );
      this.log.log('task:delete', `Deleted task "${t.title}"`);
    });
  }

  drop(
    ev: CdkDragDrop<Task[]>,
    status: 'todo' | 'inprogress' | 'done',
  ) {
    if (ev.previousContainer === ev.container) {
      moveItemInArray(
        ev.container.data,
        ev.previousIndex,
        ev.currentIndex,
      );
    } else {
      transferArrayItem(
        ev.previousContainer.data,
        ev.container.data,
        ev.previousIndex,
        ev.currentIndex,
      );
    }

    const task = ev.container.data[ev.currentIndex];
    const dto: TaskDto = { ...task, status } as any;

    this.tasksSvc.update(task.id, dto).subscribe((nt) => {
      this.tasksSvc.tasks.set(
        this.tasksSvc.tasks().map((x) => (x.id === nt.id ? nt : x)),
      );
    });
  }
}
