import { Component, OnInit, inject, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { DashboardService } from '../../../services/dashboard.service';
import { DietData } from '../../../services/dashboard.service';

interface MacroItem {
  label: string;
  value: number;
  total: number;
}

@Component({
  selector: 'app-dashboard-dieta',
  templateUrl: './Dashboard-Dieta.html',
  styleUrls: ['./Dashboard-Dieta.css'],
  imports: [RouterModule],
})
export class DashboardDietaComponent implements OnInit {
  readonly MOMENTOS = ['Desayuno', 'Almuerzo', 'Cena'] as const;
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

  verPlanCompleto() {
    this.router.navigate(['/personalPlan/dieta']);
  }

  private updateData(data: DietData) {
    // 1. Guard clause: If data is missing, don't execute to avoid "cannot read property of undefined"
    /*if (!data || !data.dieta) {
      this.loading = false;
      return;
    }*/
  }
}
