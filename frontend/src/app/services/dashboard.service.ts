import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
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
}
