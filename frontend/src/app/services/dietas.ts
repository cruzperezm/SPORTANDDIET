import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class DietaService {
  private jsonUrl = 'assets/data/dietas.json';

  constructor(private http: HttpClient) {}

  // 1. Para la página de PLAN
  obtenerPlanPorId(id: string | null): Observable<any> {
    return this.http.get<any>(this.jsonUrl).pipe(
      map(data => {
        if (!data || !data.dietas) return null;

        // Convertimos el ID de la URL a string y limpiamos espacios
        const idLimpio = String(id).trim();

        // Buscamos convirtiendo también el ID del JSON a string
        const encontrado = data.dietas.find((d: any) => String(d.id).trim() === idLimpio);

        // PLAN B: Si no lo encuentra tras recargar, devuelve la dieta 1
        if (!encontrado) {
          console.warn("⚠️ No se encontró el ID en el JSON. Cargando dieta por defecto.");
          return data.dietas[0];
        }

        return encontrado;
      })
    );
  }

  // 2. Para la página de DETALLE (Corrige el error TS2339)
  obtenerRecetaPorId(id: string | null): Observable<any> {
    return this.http.get<any>(this.jsonUrl).pipe(
      map(data => {
        let recetaEncontrada = null;
        data.dietas.forEach((dieta: any) => {
          dieta.plan.forEach((fase: any) => {
            const receta = fase.comidas.find((c: any) => c.id === id);
            if (receta) recetaEncontrada = receta;
          });
        });
        return recetaEncontrada;
      })
    );
  }

  // 3. Para el BUSCADOR de la página de inicio (Corrige el error TS2339)
  buscarRecetas(termino: string): Observable<any[]> {
    return this.http.get<any>(this.jsonUrl).pipe(
      map(data => {
        const resultados: any[] = [];
        const busqueda = termino.toLowerCase();
        data.dietas.forEach((dieta: any) => {
          dieta.plan.forEach((fase: any) => {
            fase.comidas.forEach((c: any) => {
              if (c.nombre.toLowerCase().includes(busqueda)) {
                resultados.push(c);
              }
            });
          });
        });
        return resultados;
      })
    );
  }
}
