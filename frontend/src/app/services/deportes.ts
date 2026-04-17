import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DeporteService {
  private jsonUrl = 'assets/data/deportes.json';

  constructor(private http: HttpClient) {}

  obtenerPlanDeportivo(planId: string | null): Observable<any[]> {
    return this.http.get<any>(this.jsonUrl).pipe(
      map((data) => {
        if (!data || !data.categoriasPlan || !data.ejercicios) return [];

        const ejerciciosDeEstePlan = data.ejercicios.filter(
          (ej: any) => String(ej.planId) === String(planId),
        );

        const categoriasConEjercicios = data.categoriasPlan.map((categoria: any) => {
          const ejerciciosEncontrados = ejerciciosDeEstePlan.filter(
            (ej: any) => ej.categoriaId === categoria.id,
          );

          return {
            titulo: categoria.nombre,
            indiceActual: 0,
            ejercicios: ejerciciosEncontrados,
          };
        });

        return categoriasConEjercicios;
      }),
    );
  }

  obtenerEjercicioPorId(id: string | null): Observable<any> {
    return this.http.get<any>(this.jsonUrl).pipe(
      map((data) => {
        if (!data || !data.categorias) return null;
        for (let categoria of data.categorias) {
          const encontrado = categoria.ejercicios.find((ej: any) => ej.id == id);
          if (encontrado) return encontrado;
        }
        return null;
      }),
    );
  }
  //para calcular las calor
  calcularCaloriasReales(met: number, minutos: number, pesoKg: number = 70): number {
    //Calorías = MET x Peso(kg) x (Tiempo en horas)
    const horas = minutos / 60;
    const caloriasQuemadas = met * pesoKg * horas;

    return Math.round(caloriasQuemadas);
  }
  //buscador
  buscarEjercicios(termino: string): Observable<any[]> {
    return this.http.get<any>(this.jsonUrl).pipe(
      map((data) => {
        const texto = termino.toLowerCase().trim();
        let resultados: any[] = [];

        if (!data || !data.categorias) return [];

        data.categorias.forEach((categoria: any) => {
          const ejerciciosEncontrados = categoria.ejercicios.filter((ej: any) => {
            const coincideNombre = ej.nombre.toLowerCase().includes(texto);
            const coincideEtiqueta = ej.etiquetas?.some((etq: string) =>
              etq.toLowerCase().includes(texto),
            );
            const coincideMusculo = ej.musculos?.some((m: string) =>
              m.toLowerCase().includes(texto),
            );

            return coincideNombre || coincideEtiqueta || coincideMusculo;
          });

          const ejerciciosMapeados = ejerciciosEncontrados.map((ej: any) => ({
            ...ej,
            nombreCategoria: categoria.titulo,
          }));
          resultados = [...resultados, ...ejerciciosMapeados];
        });

        return resultados;
      }),
    );
  }
}
