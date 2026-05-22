import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
export interface Exercise {
  id: number;
  name: string;
  image: string;
  duration: number;
  level: string;
}

interface Day {
  dia: string;
  valor: number;
}

interface SportDailyPlan {
  id: number;
  date: Date;
  exercises: Exercise[];
}
export interface SportData {
  userId: number;
  week: Day[];
  updatedAt: Date;
  calories: number;
  time: number;
  dailyPlan: SportDailyPlan;
}

export interface Recipe {
  id: string;
  name: string;
  image: string;
  calories: number;
  moment: string;
}

interface DietDailyPlan {
  id: number;
  date: Date;
  recipes: Recipe[];
}
export interface DietData {
  calories_total: number;
  calories_goal: number;
  protein: number;
  fats: number;
  carbs: number;
  water: number;
  updatedAt: Date;
  dailyPlan: DietDailyPlan;
}
@Injectable({
  providedIn: 'root',
})
export class DashboardService {
  constructor(private http: HttpClient) {}

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

  addFavoriteRecipe(recipeId: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/dashboard/dieta/favorito`, { recipeId });
  }

  addFavoriteExercise(exerciseId: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/dashboard/deporte/favorito`, { exerciseId });
  }

  removeFavoriteRecipe(recipeId: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/favoritos/receta/remove`, { recipeId });
  }

  removeFavoriteExercise(exerciseId: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/favoritos/ejercicio/remove`, { exerciseId });
  }
}
