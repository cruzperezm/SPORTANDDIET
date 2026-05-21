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

  eliminar(recipeId: string) {
    const x = localStorage.getItem('Dietas');
    if (x != null) {
      this.reList = JSON.parse(x);
    }
    const elem = this.reList.find((val) => val.id === recipeId);
    const i = this.reList.indexOf(elem);
    this.reList.splice(i, 1);
    localStorage.setItem('Dietas', JSON.stringify(this.reList));
  }

  inList(recipeId: string) {
    const x = localStorage.getItem('Dietas');
    if (x != null) {
      this.reList = JSON.parse(x);
    }
    const elem = this.reList.find((val) => val.id === parseInt(recipeId));
    const i = this.reList.indexOf(elem);
    return i != -1;
  }
}
