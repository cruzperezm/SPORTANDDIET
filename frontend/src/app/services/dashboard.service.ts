import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
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
  constructor(private http: HttpClient) {}

  getDietaDashboard(): Observable<any> {
    // 1. Recuperamos el token donde lo guardes al hacer login (suele ser en localStorage)
    const token = localStorage.getItem('token'); // <-- Ajusta esto si tu variable se llama diferente

    // 2. Creamos las cabeceras con el token
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    // 3. Hacemos la petición enviando las cabeceras
    return this.http.get('http://localhost:3000/api/dashboard/dieta', { headers });
  }

  getDeporteDashboard(): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get('http://localhost:3000/api/dashboard/deporte', { headers });
  }

  // Y asegúrate de hacer lo mismo para los métodos de "Añadir a Favoritos"
  addFavoriteRecipe(recipeId: number): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.post(
      'http://localhost:3000/api/dashboard/dieta/favorito',
      { recipeId },
      { headers },
    );
  }

  addFavoriteExercise(exerciseId: number): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.post(
      'http://localhost:3000/api/dashboard/deporte/favorito',
      { exerciseId },
      { headers },
    );
  }
}
