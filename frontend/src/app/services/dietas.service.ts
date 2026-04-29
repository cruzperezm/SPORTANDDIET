import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DietService {
  private apiUrl = 'http://localhost:3000';

  constructor(private http: HttpClient) {}

  getAllDiets(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/diets/all`);
  }

  getDietById(id: string): Observable<any[]> {
    let params = new HttpParams();
    params = params.set('id', id);
    return this.http.get<any[]>(`${this.apiUrl}/diets`, { params });
  }

  getRecipesByMoment(id: string, moment: string): Observable<any[]> {
    let params = new HttpParams();
    params = params.set('dietId', id);
    params = params.set('moment', moment);
    return this.http.get<any[]>(`${this.apiUrl}/diets/recipes/moment`, { params });
  }

  getRecipeById(id: string) {
    let params = new HttpParams();
    params = params.set('id', id);
    return this.http.get<any[]>(`${this.apiUrl}/diets/recipes`, { params });
  }

  search(searchString: string): Observable<any[]> {
    let params = new HttpParams();
    params = params.set('searchString', searchString);
    params = params.set('type', 'diets');
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

  filter(dietId: string, filters: string[], moment: string): Observable<any[]> {
    let params = new HttpParams();

    if (filters && filters.length > 0) {
      params = params.set('tags', filters.join(','));
    }
    params = params.set('dietId', dietId);
    params = params.set('type', 'diets');
    params = params.set('moment', moment);

    return this.http.get<any[]>(`${this.apiUrl}/search/filter`, { params });
  }
}
