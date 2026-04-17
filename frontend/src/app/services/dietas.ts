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
    const urlFresca = `${this.jsonUrl}?t=${new Date().getTime()}`;

    return this.http.get<any>(urlFresca).pipe(
      map((data) => {
        const planEncontrado = data.planes[id || '1'] || [];

        return planEncontrado.map((cat: any) => ({
          ...cat,
          indiceActual: 0,
        }));
      }),
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

  //buscador
  buscarRecetas(termino: string): Observable<any[]> {
    return this.http.get<any>(this.jsonUrl).pipe(
      map((data) => {
        const texto = termino.toLowerCase().trim();

        const recetasEncontradas = data.recetas.filter((receta: any) => {
          const coincideNombre = receta.nombre.toLowerCase().includes(texto);
          const coincideIngrediente = receta.ingredientes.some((ing: string) =>
            ing.toLowerCase().includes(texto),
          );
          return coincideNombre || coincideIngrediente;
        });

        return recetasEncontradas.map((receta: any) => {
          const dieta = data.dietasInicio.find((d: any) => d.id === receta.dietaId);
          return {
            ...receta,
            nombreDieta: dieta ? dieta.nombre : 'General',
          };
        });
      }),
    );
  }
}
