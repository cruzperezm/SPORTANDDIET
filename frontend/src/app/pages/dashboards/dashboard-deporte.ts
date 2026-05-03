import { Component, OnInit, inject, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Subscription, interval } from 'rxjs';
import { switchMap, catchError } from 'rxjs/operators';
import { of } from 'rxjs';

interface SportData {
  usuario: { nombre: string };
  actividades: Array<{ nombre: string; valor: string }>;
  deporte: {
    semana: Array<{ dia: string; valor: number }>;
    ejercicios: Array<{ nombre: string; valor: string }>;
  };
}

@Component({
  selector: 'app-dashboard-deporte',
  templateUrl: './Dashboard-Deporte.html',
  styleUrls: ['./Dashboard-Deporte.css'],
})
export class DashboardDeporteComponent implements OnInit, OnDestroy {
  private http = inject(HttpClient);
  private router = inject(Router);

  // Backend API URL (your Prisma backend)
  private apiUrl = 'http://localhost:3000/api/dashboard/deporte'; // Adjust port

  private subscription?: Subscription;

  weekData: Array<{ dia: string; valor: number }> = [];

  userName = '';
  moveText = '';
  moveCalories = '';
  exerciseText = '';
  exerciseCalories = '';
  standText = '';
  standCalories = '';

  trainText1 = '';
  trainAmount1 = '';
  trainText2 = '';
  trainAmount2 = '';
  trainText3 = '';
  trainAmount3 = '';
  trainText4 = '';
  trainAmount4 = '';
  trainText5 = '';
  trainAmount5 = '';

  loading = true;
  error = '';

  ngOnInit() {
    // Poll every 30 seconds (or use WebSocket/SSE for real-time)
    this.subscription = interval(30000)
      .pipe(
        switchMap(() => this.fetchDeporteData()),
        catchError((err) => {
          console.error('Error fetching deporte data:', err);
          this.error = 'Failed to load dashboard';
          this.loading = false;
          return of(null);
        }),
      )
      .subscribe((data) => {
        if (data) {
          this.updateData(data);
          this.loading = false;
        }
      });

    // Initial load
    this.fetchDeporteData().subscribe((data) => {
      if (data) this.updateData(data);
    });
  }

  ngOnDestroy() {
    this.subscription?.unsubscribe();
  }

  // Fetch data from Prisma backend
  // Cambiar fetchDeporteData()
  private fetchDeporteData() {
    const userId = localStorage.getItem('userId');
    return inject(DashboardService).getDeporteDashboard(userId);
  }

  // Navigation methods
  toggleToDieta() {
    this.router.navigate(['/dashboard-dieta']);
  }

  goToDeporte() {
    this.router.navigate(['/deporte']);
  }

  private updateData(data: SportData) {
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
  }
}
