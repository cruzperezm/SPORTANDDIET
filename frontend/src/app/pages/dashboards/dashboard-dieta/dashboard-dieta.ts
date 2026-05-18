import { Component, OnInit, inject, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, Subscription, interval } from 'rxjs';
import { switchMap, catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import { DashboardService } from '../../../services/dashboard.service';
import { DietData, SportData } from '../../../services/dashboard.service';

interface MacroItem {
  label: string;
  value: number;
  total: number;
}

@Component({
  selector: 'app-dashboard-dieta',
  templateUrl: './Dashboard-Dieta.html',
  styleUrls: ['./Dashboard-Dieta.css'],
})
export class DashboardDietaComponent implements OnInit {
  private router = inject(Router);
  private dashboardService = inject(DashboardService);
  private cdr = inject(ChangeDetectorRef);

  declare dietaData: DietData;
  declare macroList: Array<MacroItem>;

  dashboardTitle = 'Dashboard nutricional';

  /*
  Tareas pendientes:
  - Añadir el botón de "Añadir receta" en la parte de arriba de la lista de recetas
  - Implementar lógica de recomendaciones de las recetas del día en la lista de la derecha
  - Implementar botón que te lleve la página de tu plan personal, donde puedes ver tus recetas
  y ejercicios siguiendo la estética de los planes de dieta y ejercicios pero que contenga
  solo las recetas y ejercicios en tu plan, divididos por momento del dia o dificultad
  - Arreglar el CSS de la cruz (que ahora es la imagen de la receta) 
  - Añadir botones de + y - al valor del agua que actualice la BD cada vez que se pulse,
  implementar función "updateWater()" o similar
  */

  loading = true;
  error = '';

  ngOnInit() {
    this.dashboardService.getDietaDashboard().subscribe({
      next: (data) => {
        this.dietaData = data;
        this.macroList = [
          { label: 'Proteína', value: this.dietaData.protein, total: 150 },
          { label: 'Grasas', value: this.dietaData.fats, total: 100 },
          { label: 'Carbs', value: this.dietaData.carbs, total: 300 },
        ];
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Ha ocurrido un error al obtener la información del dashboard:', err);
      },
    });
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
