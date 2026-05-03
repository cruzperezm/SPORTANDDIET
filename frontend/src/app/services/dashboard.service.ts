import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DashboardService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:3000/api/dashboard';

  private getHeaders(): HttpHeaders {
    return new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('token') || ''}`,
    });
  }

  getDietaDashboard(userId?: string | null): Observable<any> {
    const params = userId ? `?userId=${userId}` : '';
    return this.http.get(`${this.apiUrl}/dieta${params}`, {
      headers: this.getHeaders(),
    });
  }

  getDeporteDashboard(userId?: string | null): Observable<any> {
    const params = userId ? `?userId=${userId}` : '';
    return this.http.get(`${this.apiUrl}/deporte${params}`, {
      headers: this.getHeaders(),
    });
  }

  upsertDashboard(dashboardData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/upsert`, dashboardData, {
      headers: this.getHeaders(),
    });
  }
}