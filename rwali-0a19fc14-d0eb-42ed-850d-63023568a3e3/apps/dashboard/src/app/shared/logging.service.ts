import { Injectable, signal } from '@angular/core';

export interface UiLogEntry {
  id: number;
  ts: string;
  type: string;
  message: string;
}

@Injectable({ providedIn: 'root' })
export class LoggingService {
  entries = signal<UiLogEntry[]>([]);
  private _id = 1;

  log(type: string, message: string) {
    const entry: UiLogEntry = {
      id: this._id++,
      ts: new Date().toISOString(),
      type,
      message,
    };
    const arr = [entry, ...this.entries()];
    this.entries.set(arr.slice(0, 100)); // keep last 100
    console.log('[UI-LOG]', type, message);
  }
}
