import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SportService {
  private apiUrl = 'http://localhost:3000';

  constructor(private http: HttpClient) {}

  getAllPlans(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/exercisePlans/all`);
  }

  // Pendiente de implementar en backend
  getPlanById(id: string): Observable<any[]> {
    let params = new HttpParams();
    params = params.set('id', id);
    return this.http.get<any[]>(`${this.apiUrl}/exercisePlans`, { params });
  }

  getExercisesByLevel(id: string, level: string): Observable<any[]> {
    let params = new HttpParams();
    params = params.set('planId', id);
    params = params.set('level', level);
    return this.http.get<any[]>(`${this.apiUrl}/exercisePlans/exercises/level`, { params });
  }

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

  private filtrosSubject = new BehaviorSubject<string[]>([]);

  filtrosActivos$ = this.filtrosSubject.asObservable();

  setFiltros(filtros: string[]) {
    this.filtrosSubject.next(filtros);
  }

  getFiltrosActuales(): string[] {
    return this.filtrosSubject.value;
  }

  filter(planId: string, filters: string[], level: string): Observable<any[]> {
    let params = new HttpParams();

    if (filters && filters.length > 0) {
      params = params.set('tags', filters.join(','));
    }
    params = params.set('planId', planId);
    params = params.set('type', 'exercises');
    params = params.set('classification', level);

    return this.http.get<any[]>(`${this.apiUrl}/search/filter`, { params });
  }
}
