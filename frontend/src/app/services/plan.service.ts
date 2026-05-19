import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';

interface Exercise {
  id: number;
  name: string;
  image: string;
}

export interface Exercises {
  Principiante: Exercise[];
  Intermedio: Exercise[];
  Avanzados: Exercise[];
}

interface Recipe {
  id: number;
  name: string;
  image: string;
}

export interface Recipes {
  Desayuno: Recipe[];
  Almuerzo: Recipe[];
  Cena: Recipe[];
}

@Injectable({
  providedIn: 'root',
})
export class PlanService {
  private apiUrl = 'http://localhost:3000';

  constructor(private http: HttpClient) {}

  getExercisesByLevel(): Observable<Exercises> {
    return this.http.get<Exercises>(`${this.apiUrl}/userPlan/deporte`);
  }

  getRecipesByMoment(): Observable<Recipes> {
    return this.http.get<Recipes>(`${this.apiUrl}/userPlan/dieta`);
  }
}
