import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { OrgNode } from './models'; // <-- make sure models.ts exports OrgNode

@Injectable({ providedIn: 'root' })
export class OrgService {
  constructor(private http: HttpClient) {}

  getTree() {
    return this.http.get<OrgNode | null>(`${environment.apiUrl}/org/tree`);
  }
}
