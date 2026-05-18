import { Component, OnInit, inject, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { DashboardService, SportData } from '../../../services/dashboard.service';

@Component({
  selector: 'app-dashboard-deporte',
  templateUrl: './Dashboard-Deporte.html',
  styleUrls: ['./Dashboard-Deporte.css'],
  imports: [FontAwesomeModule],
})
export class DashboardDeporteComponent implements OnInit {
  private http = inject(HttpClient);
  private router = inject(Router);
  private dashboardService = inject(DashboardService);
  private cdr = inject(ChangeDetectorRef);

  declare deporteData: SportData;

  dashboardTitle = 'Dashboard de actividad';

  /*Tareas pendientes:
  - Si tenemos actividades (ya están creadas en la BD) se necesita un botón para
  añadir una nueva actividad que muestre un formulario en overlay
  - Si usamos las actividades y los ejercicios asignados en el día para calcular
  el porcentaje hay que ver cómo se harían los cálculos
  - Establecer un total de ejercicio (y la unidad de medida: tiempo, kcal quemadas),
  probablemente a partir de los objetivos del usuario
  */

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

  loading = true;
  error = '';

  ngOnInit() {
    this.dashboardService.getDeporteDashboard().subscribe({
      next: (data) => {
        this.deporteData = data;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Ha ocurrido un error al obtener la información del dashboard:', err);
      },
    });
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
