import { Component, OnInit, inject, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { DashboardService, Recipe } from '../../../services/dashboard.service';
import { DietData } from '../../../services/dashboard.service';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faBookmark } from '@fortawesome/free-solid-svg-icons';
import { faAppleWhole } from '@fortawesome/free-solid-svg-icons/faAppleWhole';

interface MacroItem {
  label: string;
  value: number;
  total: number;
}

@Component({
  selector: 'app-dashboard-dieta',
  templateUrl: './Dashboard-Dieta.html',
  styleUrls: ['./Dashboard-Dieta.css'],
  imports: [RouterModule, FontAwesomeModule],
})
export class DashboardDietaComponent implements OnInit {
  readonly MOMENTOS = ['Desayuno', 'Almuerzo', 'Cena'] as const;
  private router = inject(Router);
  private dashboardService = inject(DashboardService);
  private cdr = inject(ChangeDetectorRef);

  declare dietaData: DietData;
  declare macroList: Array<MacroItem>;

  faApple = faAppleWhole;
  faBookmark = faBookmark;
  reList: any[] = [];

  dashboardTitle = 'Dashboard nutricional';

  loading = true;
  error = '';

  ngOnInit() {
    this.loading = true; // Aseguramos que empiece cargando

    this.dashboardService.getDietaDashboard().subscribe({
      next: (data) => {
        this.dietaData = data;
        this.macroList = [
          { label: 'Proteína', value: this.dietaData.protein, total: 150 },
          { label: 'Grasas', value: this.dietaData.fats, total: 100 },
          { label: 'Hidratos', value: this.dietaData.carbs, total: 300 },
        ];
        this.loading = false; // Los datos han llegado
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Ha ocurrido un error al obtener la información del dashboard:', err);
        this.error = 'No se pudo cargar el dashboard nutricional.';
        this.loading = false; // Quitamos el estado de carga si hay error
        this.cdr.detectChanges();
      },
    });
  }

  toggleToDeporte() {
    this.router.navigate(['/dashboard/deporte']);
  }

  verPlanCompleto() {
    this.router.navigate(['/personalPlan/dieta']);
  }

  goToDietas() {
    this.router.navigate(['/dietas']);
  }

  addToDashboard(recipeId: number) {
    this.dashboardService.addFavoriteRecipe(recipeId).subscribe({
      next: (res: any) => {
        console.log('Receta guardada en tus favoritos globales para futuros sorteos:', res);
      },
      error: (err: any) => console.error('Error al añadir la receta a favoritos:', err),
    });
  }

  guardar(recipe: Recipe) {
    const x = localStorage.getItem('Dietas');
    if (x != null) {
      this.reList = JSON.parse(x);
    }
    if (recipe.id != null) {
      try {
        this.dashboardService.addFavoriteRecipe(parseInt(recipe.id)).subscribe();
      } catch (err) {
        console.log(err);
      }
    }
    this.reList.push(recipe);
    localStorage.setItem('Dietas', JSON.stringify(this.reList));
  }

  eliminar(recipeId: string | number) {
    // 1. Convertimos a número de forma segura sin importar lo que llegue
    const idNum = Number(recipeId);

    const x = localStorage.getItem('Dietas');
    if (x != null) {
      this.reList = JSON.parse(x);
    }

    // 2. Forzamos la comparación numérica para que coincida 100%
    const elem = this.reList.find((val) => Number(val.id) === idNum);
    if (elem) {
      const i = this.reList.indexOf(elem);
      this.reList.splice(i, 1);
      localStorage.setItem('Dietas', JSON.stringify(this.reList));
    }

    // 3. Enviamos el idNum (que ya es un número real) a tu servicio
    try {
      this.dashboardService.removeFavoriteRecipe(idNum).subscribe({
        next: (res: any) => console.log('Desvinculado de Prisma exitosamente', res),
        error: (err: any) => console.error('Error al desvincular:', err)
      });
    } catch (err) {
      console.log(err);
    }
  }

  inList(recipeId: string | number) {
    const idNum = Number(recipeId);
    const x = localStorage.getItem('Dietas');
    if (x != null) {
      this.reList = JSON.parse(x);
    }
    // Simplificado y a prueba de errores de tipado
    return this.reList.some((val) => Number(val.id) === idNum);
  }
}
