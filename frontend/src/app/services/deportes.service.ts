import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SportService {
  private apiUrl = 'http://localhost:3000';

  constructor(private http: HttpClient) {}

  getPlanById() {}

  getExerciseById() {}

  search(searchString: string, type: string): Observable<any[]> {
    let params = new HttpParams();
    params = params.set('searchString', searchString);
    params = params.set('type', type);
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
