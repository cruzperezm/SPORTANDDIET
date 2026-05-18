import { Component, OnInit, inject, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, Subscription, interval } from 'rxjs';
import { switchMap, catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import { DashboardService } from '../../../services/dashboard.service';

interface MacroItem {
  nombre: string;
  valor: string | number;
  progreso?: number;
}

interface DietData {
  usuario: { nombre: string };
  dieta: {
    calorias_objetivo: number;
    calorias_totales: number;
    protein: number;
    fats: number;
    carbs: number;
    water: number;
    recetas: any[];
  };
}

@Component({
  selector: 'app-dashboard-dieta',
  templateUrl: './Dashboard-Dieta.html',
  styleUrls: ['./Dashboard-Dieta.css'],
})
export class DashboardDietaComponent implements OnInit, OnDestroy {
  private router = inject(Router);
  private dashboardService = inject(DashboardService);

  private subscription?: Subscription;
  dietaData$!: Observable<any[]>;

  userName = 'Dashboard nutricional';
  caloriesGoal = 2500;
  caloriesAmount = 1850;
  waterAmount = '2.5L';
  waterText = 'Hidratación';
  fiberAmount = '25g';
  fiberText = 'Fibra';

  // Macro Progress (0 to 100)
  macroList = [
    { id: 'protein', label: 'Proteína', amount: 120, total: 200, progress: 75 },
    { id: 'fats', label: 'Grasas', amount: 45, total: 100, progress: 40 },
    { id: 'carbs', label: 'Carbs', amount: 210, total: 300, progress: 60 },
    { id: 'sodium', label: 'Sodio', amount: 1.2, total: 5, progress: 30 },
    { id: 'sugar', label: 'Azúcar', amount: 20, total: 100, progress: 15 },
  ];

  // The "Action Items" Array for the @for loop
  dietItems = [
    { id: 1, text: 'Desayuno Saludable', amount: '450 kcal' },
    { id: 2, text: 'Almuerzo Proteico', amount: '700 kcal' },
    { id: 3, text: 'Snack Pre-Entreno', amount: '200 kcal' },
    { id: 4, text: 'Cena Ligera', amount: '400 kcal' },
    { id: 5, text: 'Suplementación', amount: '100 kcal' },
  ];

  loading = true;
  error = '';

  ngOnInit() {
    // Initial load
    /*this.fetchDietaData().subscribe((data) => {
      if (data) this.updateData(data);
    });

    // Poll every 30 seconds
    this.subscription = interval(30000)
      .pipe(
        switchMap(() => this.fetchDietaData()),
        catchError((err) => {
          console.error('Error fetching dieta data:', err);
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

  private fetchDietaData() {
    return this.dashboardService.getDietaDashboard();
  }

  toggleToDeporte() {
    this.router.navigate(['/dashboard/deporte']);
  }

  goToDietas() {
    this.router.navigate(['/dietas']);
  }

  private updateData(data: DietData) {
    // 1. Guard clause: If data is missing, don't execute to avoid "cannot read property of undefined"
    /*if (!data || !data.dieta) {
      this.loading = false;
      return;
    }

    // 2. Basic Info
    this.userName = data.usuario?.nombre || 'Usuario';
    this.caloriesGoal = data.dieta.calorias_objetivo;
    this.caloriesAmount = data.dieta.calorias_totales;

    // 3. Macros 1 (Water/Fiber)
    const m1 = data.dieta.macros1 || [];
    this.waterAmount = m1[0]?.valor || '';
    this.waterText = m1[0]?.nombre || '';
    this.fiberAmount = m1[1]?.valor || '';
    this.fiberText = m1[1]?.nombre || '';

    // 4. Macros 2 (Proteins/Fats/etc)
    const m2 = data.dieta.macros2 || [];
    this.proteinAmount = m2[0]?.valor || '';
    this.proteinText = m2[0]?.nombre || '';
    this.proteinProgress = m2[0]?.progreso || 0;

    this.fatsAmount = m2[1]?.valor || '';
    this.fatsText = m2[1]?.nombre || '';
    this.fatsProgress = m2[1]?.progreso || 0;

    this.carbsAmount = m2[2]?.valor || '';
    this.carbsText = m2[2]?.nombre || '';
    this.carbsProgress = m2[2]?.progreso || 0;

    this.sodiumAmount = m2[3]?.valor || '';
    this.sodiumText = m2[3]?.nombre || '';
    this.sodiumProgress = m2[3]?.progreso || 0;

    this.sugarAmount = m2[4]?.valor || '';
    this.sugarText = m2[4]?.nombre || '';
    this.sugarProgress = m2[4]?.progreso || 0;

    // 5. Recipes - Updating the list for your new @for loop
    const recetas = data.dieta.recetas || [];

    // This updates the array we created for the @for loop in the previous step
    this.dietItems = recetas.map((r, index) => ({
      id: index,
      text: r.nombre || `Receta ${index + 1}`,
      amount: r.valor || '',
    }));

    // Keeping these legacy variables for now so the rest of the template doesn't break
    this.dietAmount1 = recetas[0]?.valor || '';
    this.dietText1 = recetas[0]?.nombre || '';
    this.dietAmount2 = recetas[1]?.valor || '';
    this.dietText2 = recetas[1]?.nombre || '';
    this.dietAmount3 = recetas[2]?.valor || '';
    this.dietText3 = recetas[2]?.nombre || '';
    this.dietAmount4 = recetas[3]?.valor || '';
    this.dietText4 = recetas[3]?.nombre || '';
    this.dietAmount5 = recetas[4]?.valor || '';
    this.dietText5 = recetas[4]?.nombre || '';

    this.loading = false;*/
    return;
  }
}
