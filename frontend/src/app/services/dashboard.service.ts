import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DashboardService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:3000';

  getDietaDashboard(): Observable<any> {
    return this.http.get(`${this.apiUrl}/dashboard/dieta`);
  }

  getDeporteDashboard(): Observable<any> {
    return this.http.get(`${this.apiUrl}/dashboard/deporte`);
  }

  upsertDashboard(dashboardData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/dashboard/upsert`, dashboardData);
  }
}
