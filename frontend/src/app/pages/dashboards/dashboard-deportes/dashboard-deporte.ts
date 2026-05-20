import { Component, OnInit, inject, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router, RouterModule } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { DashboardService, SportData, Exercise } from '../../../services/dashboard.service';

interface DailyPlan {
  Principiante: Exercise[];
  Intermedio: Exercise[];
  Avanzados: Exercise[];
}

@Component({
  selector: 'app-dashboard-deporte',
  templateUrl: './Dashboard-Deporte.html',
  styleUrls: ['./Dashboard-Deporte.css'],
  imports: [FontAwesomeModule, RouterModule],
})
export class DashboardDeporteComponent implements OnInit {
  readonly NIVELES = ['Principiante', 'Intermedio', 'Avanzados'] as const;
  private http = inject(HttpClient);
  private router = inject(Router);
  private dashboardService = inject(DashboardService);
  private cdr = inject(ChangeDetectorRef);

  declare deporteData: SportData;
  dailyPlanByLevel: DailyPlan = {
    Principiante: [],
    Intermedio: [],
    Avanzados: [],
  };

  dashboardTitle = 'Dashboard de actividad';

  loading = true;
  error = '';

  ngOnInit() {
    this.dashboardService.getDeporteDashboard().subscribe({
      next: (data) => {
        this.deporteData = data;
        console.log('Test', this.dailyPlanByLevel);
        for (let level of this.NIVELES) {
          for (let exercise of this.deporteData.dailyPlan.exercises) {
            if (exercise.level === level.toUpperCase()) {
              this.dailyPlanByLevel[level].push(exercise);
            }
          }
        }

        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Ha ocurrido un error al obtener la información del dashboard:', err);
      },
    });
  }

  toggleToDieta() {
    this.router.navigate(['/dashboard/dieta']);
  }

  addToDashboard(exerciseId: number) {
    this.dashboardService.addFavoriteExercise(exerciseId).subscribe({
      next: (res: any) => {
        console.log('Ejercicio añadido a tus favoritos globales', res);
      },
      error: (err) => console.error('Error al añadir a favoritos', err),
    });
  }

  verPlanCompleto() {
    this.router.navigate(['/personalPlan/deporte']);
  }

  /*private updateData(data: SportData) {
    this.userName = data.usuario.nombre;

    this.moveText = data.actividades[0]?.nombre || '';
    this.moveCalories = data.actividades[0]?.valor || '';
    this.exerciseText = data.actividades[1]?.nombre || '';
    this.exerciseCalories = data.actividades[1]?.valor || '';
    this.standText = data.actividades[2]?.nombre || '';
    this.standCalories = data.actividades[2]?.valor || '';

    this.weekData = data.deporte.semana || [];

    const exercises = data.deporte.ejercicios || [];
    for (let i = 1; i <= 5; i++) {
      const exercise = exercises[i - 1];
      (this as any)[`trainText${i}`] = exercise?.nombre || '';
      (this as any)[`trainAmount${i}`] = exercise?.valor || '';
    }
    this.loading = false;
  }*/
}
