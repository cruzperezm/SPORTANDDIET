import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DietaService {
  private jsonUrl = 'assets/data/dietas.json';

  constructor(private http: HttpClient) {}

  obtenerDietasInicio(): Observable<any[]> {
    return this.http.get<any>(this.jsonUrl).pipe(map((data) => data.dietasInicio));
  }

  obtenerPlanPorDieta(id: string | null): Observable<any[]> {
    return this.http.get<any>(this.jsonUrl).pipe(
      map(data => {
        const categorias = data.categoriasPlan || [];
        return categorias.map((cat: any) => ({
          ...cat,
          indiceActual: 0 //Importante para el crrusel
        }));
      })
    );
  }

  obtenerRecetaPorId(id: string | null): Observable<any> {
    return this.http.get<any>(this.jsonUrl).pipe(
      map((data) => {
        if (!data || !data.recetas) return null;
        return data.recetas.find((r: any) => r.id == id);
      }),
    );
  }
}
