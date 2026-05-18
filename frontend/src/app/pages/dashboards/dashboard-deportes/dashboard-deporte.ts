import { Component, OnInit, inject, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, Subscription, interval } from 'rxjs';
import { switchMap, catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import { DashboardService } from '../../../services/dashboard.service';
import {faPersonRunning} from "@fortawesome/free-solid-svg-icons/faPersonRunning";
import {FontAwesomeModule} from "@fortawesome/angular-fontawesome";

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
  imports: [FontAwesomeModule],
})
export class DashboardDeporteComponent implements OnInit, OnDestroy {
  private http = inject(HttpClient);
  private router = inject(Router);
  private dashboardService = inject(DashboardService);

  private subscription?: Subscription;

  userName = 'Dashboard de actividad';
  faRunning = faPersonRunning;

  // Activity Ring Data
  dailyActivities = [
    { text: 'Moverse', progress: '450 / 600 kcal' },
    { text: 'Ejercicio', progress: '45 / 30 min' },
    { text: 'De Pie', progress: '10 / 12 hr' },
  ];

  // Training List - Individual Variables
  trainingSessions = [
    { text: 'Carrera Matutina', amount: '5.2 km' },
    { text: 'Entrenamiento Fuerza', amount: '45 min' },
    { text: 'Sesión Yoga', amount: '20 min' },
    { text: 'Ciclismo Urbano', amount: '12 km' },
    { text: 'Estiramientos', amount: '10 min' },
  ];

  // Don't forget the chart data since the @if and @for need it to render the bars!
  weekData = [
    { dia: 'L', valor: 45 },
    { dia: 'M', valor: 30 },
    { dia: 'X', valor: 60 },
    { dia: 'J', valor: 25 },
    { dia: 'V', valor: 50 },
    { dia: 'S', valor: 80 },
    { dia: 'D', valor: 40 },
  ];

  loading = true;
  error = '';

  ngOnInit() {
    // Initial load
    /*this.fetchDeporteData().subscribe((data) => {
      if (data) this.updateData(data);
    });

    // Poll every 30 seconds
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
      });*/
  }

  ngOnDestroy() {
    this.subscription?.unsubscribe();
  }

  private fetchDeporteData() {
    return this.dashboardService.getDeporteDashboard();
  }

  toggleToDieta() {
    this.router.navigate(['/dashboard/dieta']);
  }

  goToDeporte() {
    this.router.navigate(['/deportes']);
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
