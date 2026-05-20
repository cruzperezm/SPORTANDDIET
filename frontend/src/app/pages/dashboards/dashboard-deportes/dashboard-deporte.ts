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
