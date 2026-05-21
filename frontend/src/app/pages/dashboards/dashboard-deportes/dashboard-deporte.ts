import { Component, OnInit, inject, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { DashboardService } from '../../../services/dashboard.service';

interface ActivityItem {
  text: string;
  progress: string;
}

interface TrainingItem {
  id: number;
  text: string;
  amount: string;
}

@Component({
  selector: 'app-dashboard-deporte',
  templateUrl: './Dashboard-Deporte.html',
  styleUrls: ['./Dashboard-Deporte.css'],
})
export class DashboardDeporteComponent implements OnInit, OnDestroy {
  private router = inject(Router);
  private dashboardService = inject(DashboardService);
  private subscription?: Subscription;

  userName = 'Dashboard de actividad';

  // Datos para los anillos de actividad
  dailyActivities: ActivityItem[] = [
    { text: 'Moverse', progress: '0 kcal' },
    { text: 'Ejercicio', progress: '0 min' },
    { text: 'De Pie', progress: '0 hr' },
  ];

  // Datos para el gráfico de la semana
  weekData = [
    { dia: 'L', valor: 0 },
    { dia: 'M', valor: 0 },
    { dia: 'X', valor: 0 },
    { dia: 'J', valor: 0 },
    { dia: 'V', valor: 0 },
    { dia: 'S', valor: 0 },
    { dia: 'D', valor: 0 },
  ];

  trainingSessions: TrainingItem[] = [];

  ngOnInit() {
    // 💥 CONEXIÓN REAL AL BACKEND: Esto dispara el flujo de cálculo diario
    this.subscription = this.dashboardService.getDeporteDashboard().subscribe({
      next: (data: any) => {
        console.log('¡Datos recibidos de deporte!', data);
        if (!data) return;

        this.userName = data.usuario?.nombre
          ? `Actividad de ${data.usuario.nombre}`
          : 'Dashboard de actividad';

        // 1. Mapeamos las métricas de arriba (Moverse, Ejercicio, De Pie)
        if (data.actividades && data.actividades.length > 0) {
          this.dailyActivities = [
            { text: 'Moverse', progress: data.actividades[0]?.valor || '0 kcal' },
            { text: 'Ejercicio', progress: data.actividades[1]?.valor || '0 min' },
            { text: 'De Pie', progress: data.actividades[2]?.valor || '0 hr' },
          ];
        }

        // 2. Mapeamos los 5 ejercicios calculados por el algoritmo de hoy
        const ejerciciosCalculados = data.deporte?.ejercicios || [];

        this.trainingSessions = ejerciciosCalculados.map((e: any, index: number) => {
          // Extraemos la información de si va por repeticiones (stats) o por tiempo (duration)
          let exerciseAmount = '15 min';
          if (e.stats && e.stats.length >= 2) {
            exerciseAmount = `${e.stats[0]} series | ${e.stats[1]} reps`;
          } else if (e.duration) {
            exerciseAmount = `${e.duration} min`;
          }

          return {
            id: e.id || index,
            text: e.name || `Ejercicio ${index + 1}`,
            amount: exerciseAmount,
          };
        });
      },
      error: (err) => {
        console.error('Error crítico al obtener el dashboard de deporte:', err);
      },
    });
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  toggleToDieta() {
    this.router.navigate(['/dieta']);
  }

  // Enlazamos el botón "+" a los "Me Gusta"
  addToDashboard(exerciseId: number) {
    this.dashboardService.addFavoriteExercise(exerciseId).subscribe({
      next: (res: any) => {
        console.log('Ejercicio añadido a tus favoritos globales', res);
      },
      error: (err) => console.error('Error al añadir a favoritos', err),
    });
  }
}
