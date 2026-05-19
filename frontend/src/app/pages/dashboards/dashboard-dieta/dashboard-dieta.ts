import { Component, OnInit, inject, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { DashboardService } from '../../../services/dashboard.service';

interface MacroItem {
  id: number;
  label: string;
  amount: number;
  total: number;
}

interface DietItem {
  id: number;
  text: string;
  amount: string | number;
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

  // Variables enlazadas directamente con las expresiones del HTML
  userName = 'Dashboard nutricional';
  caloriesGoal = 2000;
  caloriesAmount = 0;
  waterAmount = '0 L';
  fiberAmount = '0 g';

  macroList: MacroItem[] = [];
  dietItems: DietItem[] = [];

  ngOnInit() {
    // 💥 CONEXIÓN REAL AL BACKEND: Esto dispara el flujo de cálculo diario
    this.subscription = this.dashboardService.getDietaDashboard().subscribe({
      next: (data: any) => {
        console.log('¡Datos recibidos del backend con éxito!', data);
        if (!data) return;

        // 1. Mapeamos información general de cabecera y el gráfico circular
        this.userName = data.usuario?.nombre
          ? `Dashboard de ${data.usuario.nombre}`
          : 'Dashboard nutricional';
        this.caloriesGoal = data.dieta?.calorias_objetivo || 2000;
        this.caloriesAmount = data.dieta?.calorias_totales || 0;
        this.waterAmount = `${data.dieta?.water || 0} L`;
        this.fiberAmount = '25 g'; // Meta de fibra estándar recomendada

        // 2. Mapeamos los objetivos numéricos reales de la BBDD a tu bucle @for (macroList)
        this.macroList = [
          { id: 1, label: 'Proteínas', amount: 0, total: data.dieta?.protein || 0 },
          { id: 2, label: 'Grasas', amount: 0, total: data.dieta?.fats || 0 },
          { id: 3, label: 'Carbohidratos', amount: 0, total: data.dieta?.carbs || 0 },
        ];

        // 3. Mapeamos las 5 recetas calculadas para el día actual al bucle @for (dietItems)
        const recetasCalculadas = data.dieta?.recetas || [];
        this.dietItems = recetasCalculadas.map((r: any, index: number) => ({
          id: r.id || index,
          text: r.name || `Receta ${index + 1}`,
          amount: `${r.duration || 15} min | ${r.calories || 0} kcal`,
        }));
      },
      error: (err) => {
        console.error('Error crítico al consumir el servicio del Dashboard de Dieta:', err);
      },
    });
  }

  toggleToDeporte() {
    this.router.navigate(['/dashboard/deporte']);
  }

  toggleToDieta() {
    this.router.navigate(['/dashboard/dieta']);
  }

  // Lógica del botón "+" para guardar la sugerencia en tu lista global de "Me gusta"
  addToDashboard(recipeId: number) {
    this.dashboardService.addFavoriteRecipe(recipeId).subscribe({
      next: (res: any) => {
        console.log('Receta guardada en tus favoritos globales para futuros sorteos:', res);
      },
      error: (err: any) => console.error('Error al añadir la receta a favoritos:', err),
    });
  }

  ngOnDestroy() {
    // Evitamos fugas de memoria cancelando la suscripción al cambiar de vista
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}
