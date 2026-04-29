import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SportService {
  private apiUrl = 'http://localhost:3000';

  constructor(private http: HttpClient) {}

  // Pendiente de implementar en backend
  getPlanById(id: string): Observable<any[]> {
    let params = new HttpParams();
    params = params.set('id', id);
    return this.http.get<any[]>(`${this.apiUrl}/exercisePlans`, { params });
  }

  // Pendiente de implementar en backend
  getExerciseById(id: string): Observable<any[]> {
    let params = new HttpParams();
    params = params.set('id', id);
    return this.http.get<any[]>(`${this.apiUrl}/exercisePlans/exercises`, { params });
  }

  search(searchString: string): Observable<any[]> {
    let params = new HttpParams();
    params = params.set('searchString', searchString);
    params = params.set('type', 'exercises');
    return this.http.get<any[]>(`${this.apiUrl}/search/basicSearch`, { params });
  }

  filter(filters: string[]): Observable<any[]> {
    let params = new HttpParams();

    if (filters && filters.length > 0) {
      params = params.set('tags', filters.join(','));
    }

    return this.http.get<any[]>(`${this.apiUrl}/search/filter`, { params });
  }
}
