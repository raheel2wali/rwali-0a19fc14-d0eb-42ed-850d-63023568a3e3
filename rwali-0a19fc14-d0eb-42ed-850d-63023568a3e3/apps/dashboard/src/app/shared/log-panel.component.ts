import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoggingService } from './logging.service';

@Component({
  selector: 'app-log-panel',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="fixed bottom-2 right-2 w-72 max-h-64 overflow-y-auto text-xs bg-black/80 text-white rounded-xl shadow-lg">
      <div class="px-3 py-2 border-b border-white/10 flex justify-between items-center">
        <span class="font-semibold text-[11px]">Activity</span>
      </div>
      <div class="px-3 py-2 space-y-1">
        <div *ngFor="let e of logger.entries()">
          <div class="font-mono text-[10px] text-gray-400">{{ e.ts | date:'shortTime' }}</div>
          <div>{{ e.type }} — {{ e.message }}</div>
        </div>
        <div *ngIf="logger.entries().length === 0" class="text-gray-400">No actions yet.</div>
      </div>
    </div>
  `,
})
export class LogPanelComponent {
  constructor(public logger: LoggingService) {}
}
