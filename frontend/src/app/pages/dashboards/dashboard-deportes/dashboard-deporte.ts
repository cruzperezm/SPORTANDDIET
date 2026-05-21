import { Component, OnInit, inject, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router, RouterModule } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faBookmark } from '@fortawesome/free-solid-svg-icons';
import { faPersonRunning } from '@fortawesome/free-solid-svg-icons/faPersonRunning';
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

  faBookmark = faBookmark;
  faRunning = faPersonRunning;

  dashboardTitle = 'Dashboard de actividad';

  exList: any[] = [];
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

  goToDeporte() {
    this.router.navigate(['/deportes']);
  }

  guardar(exercise: Exercise) {
    const x = localStorage.getItem('Deportes');
    if (x != null) {
      this.exList = JSON.parse(x);
    }
    if (exercise.id != null) {
      try {
        this.dashboardService.addFavoriteExercise(exercise.id).subscribe();
      } catch (err) {
        console.log(err);
      }
    }
    this.exList.push(exercise);
    localStorage.setItem('Deportes', JSON.stringify(this.exList));
  }

  eliminar(exerciseId: number) {
    const x = localStorage.getItem('Deportes');
    if (x != null) {
      this.exList = JSON.parse(x);
    }
    const elem = this.exList.find((val) => val.id === exerciseId);
    const i = this.exList.indexOf(elem);
    this.exList.splice(i, 1);
    localStorage.setItem('Deportes', JSON.stringify(this.exList));
  }

  inList(exerciseId: number) {
    const x = localStorage.getItem('Deportes');
    if (x != null) {
      this.exList = JSON.parse(x);
    }
    const elem = this.exList.find((val) => val.id === exerciseId);
    const i = this.exList.indexOf(elem);
    return i != -1;
  }
}
