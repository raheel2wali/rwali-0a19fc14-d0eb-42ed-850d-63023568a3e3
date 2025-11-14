import { Component, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TasksService } from '../../shared/tasks.service';


@Component({
  selector: 'app-progress',
  standalone: true,
  imports: [CommonModule],
  template: `
        <div class="rounded-xl border p-3 bg-white dark:bg-gray-800">
        <div class="text-sm text-gray-500 mb-1">Completion</div>
        <div class="w-full h-3 bg-gray-200 rounded">
        <div class="h-3 rounded bg-green-500" [style.width.%]="pct()"></div>
        </div>
        <div class="text-xs mt-1">{{done()}} / {{total()}} done ({{pct() | number:'1.0-0'}}%)</div>
        </div>
        `,
})
export class ProgressComponent {
  constructor(private tasks: TasksService) { }
  total = computed(() => this.tasks.tasks().length);
  done = computed(() => this.tasks.tasks().filter(t => (t as any).status === 'done').length);
  pct = computed(() => this.total() ? (this.done() / this.total()) * 100 : 0);
}
