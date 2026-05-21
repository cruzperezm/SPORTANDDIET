import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
interface Exercise {
  name: string;
  image: string;
  duration: number;
}

interface Day {
  dia: string;
  valor: number;
}
export interface SportData {
  userId: number;
  week: Day[];
  updatedAt: Date;
  calories: number;
  time: number;
  exercises: Exercise[];
}

interface Recipe {
  name: string;
  image: string;
  calories: number;
}

export interface DietData {
  calories_total: number;
  calories_goal: number;
  protein: number;
  fats: number;
  carbs: number;
  water: number;
  updatedAt: Date;
  recipes: Array<Recipe>;
}
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

  // --- NUEVOS MÉTODOS AÑADIDOS PARA SOLUCIONAR LOS ERRORES ---

  getDietData(userId: number): Observable<any> {
    // Si tu backend lo recibe por parámetro:
    return this.http.get(`${this.apiUrl}/dashboard/dieta/${userId}`);
    // Nota: Ajusta la ruta si tu backend espera algo distinto como ?userId=1
  }

  getRecipeSuggestions(): Observable<any> {
    // Apunta a la ruta de tu backend que invoca 'getRecipeSuggestions'
    return this.http.get(`${this.apiUrl}/suggestions/recipes`);
  }

  addItemToDashboard(recipeId: number): Observable<any> {
    // Ruta para añadir la receta al dashboard del usuario
    return this.http.post(`${this.apiUrl}/dashboard/addItem`, { recipeId });
  }
}
