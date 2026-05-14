import { Component, OnInit, inject, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, Subscription, interval, of } from 'rxjs';
import { switchMap, catchError } from 'rxjs/operators';
import { DashboardService } from '../../../services/dashboard.service';
import { ToastrService } from 'ngx-toastr'; // Opcional para feedback
import { CommonModule } from '@angular/common';

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
    macros1: MacroItem[];
    macros2: MacroItem[];
    recetas: MacroItem[];
  };
}

@Component({
  selector: 'app-dashboard-dieta',
  standalone: true, // Añadido para la nueva funcionalidad
  imports: [CommonModule], // Añadido para habilitar directivas como @for / *ngFor
  templateUrl: './Dashboard-Dieta.html',
  styleUrls: ['./Dashboard-Dieta.css'],
})
export class DashboardDietaComponent implements OnInit, OnDestroy {
  private router = inject(Router);
  private dashboardService = inject(DashboardService);
  private toastr = inject(ToastrService); // Inyección añadida para los avisos

  private subscription?: Subscription;
  dietaData$!: Observable<any[]>;

  // --- VARIABLES NUEVAS ---
  userName = '';
  caloriesGoal = 0;
  caloriesAmount = 0;
  sugerencias: any[] = [];
  dietItems: any[] = [];
  macroList: any[] = [];

  // Mantenemos estas variables antiguas activas por si el HTML aún las renderiza
  waterAmount = '2.5L';
  waterText = 'Hidratación';
  fiberAmount = '25g';
  fiberText = 'Fibra';
  loading = true;
  error = '';

  // --- VARIABLES ANTIGUAS (Comentadas por conflicto) ---
  /*
  userName = 'Usuario de ejemplo';
  caloriesGoal = 2500;
  caloriesAmount = 1850;

  macroList = [
    { id: 'protein', label: 'Proteína', amount: '120g', progress: 75 },
    { id: 'fats', label: 'Grasas', amount: '45g', progress: 40 },
    { id: 'carbs', label: 'Carbs', amount: '210g', progress: 60 },
    { id: 'sodium', label: 'Sodio', amount: '1.2g', progress: 30 },
    { id: 'sugar', label: 'Azúcar', amount: '20g', progress: 15 },
  ];

  dietItems = [
    { id: 1, text: 'Desayuno Saludable', amount: '450 kcal' },
    { id: 2, text: 'Almuerzo Proteico', amount: '700 kcal' },
    { id: 3, text: 'Snack Pre-Entreno', amount: '200 kcal' },
    { id: 4, text: 'Cena Ligera', amount: '400 kcal' },
    { id: 5, text: 'Suplementación', amount: '100 kcal' },
  ];
  */

  ngOnInit() {
    // --- NUEVO INICIO ---
    this.cargarDatosDashboard();
    this.cargarSugerencias();

    // --- ANTIGUO INICIO (Mantenido intacto y comentado) ---
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

  // --- NUEVA LÓGICA DE CARGA Y SUEGERENCIAS ---
  // En dashboard-dieta.ts
  cargarDatosDashboard() {
    // Obtener el ID dinámicamente desde el queryParam o el token
    const userId = parseInt(localStorage.getItem('userId') || '1');

    this.dashboardService.getDietData(userId).subscribe({
      next: (data: any) => {
        if (data && data.dieta) {
          this.userName = data.usuario.nombre;
          this.caloriesGoal = data.dieta.calorias_objetivo;
          this.caloriesAmount = data.dieta.calorias_totales;

          // Mapear los macros guardados en el JSON del backend
          const m1 = data.dieta.macros1;
          this.macroList = m1.map((m: any) => ({
            id: m.nombre.toLowerCase(),
            label: m.nombre,
            amount: m.valor + 'g',
            progress: m.progreso,
          }));

          this.dietItems = data.dieta.recetas.map((r: any) => ({
            id: r.id,
            text: r.nombre,
            amount: r.calories + ' kcal',
          }));
        }
      },
      error: (err) => {
        console.error('No se pudo cargar el dashboard', err);
      },
    });
  }

  cargarSugerencias() {
    this.dashboardService.getRecipeSuggestions().subscribe((sugs: any) => {
      this.sugerencias = sugs;
    });
  }

  addToDashboard(recipeId: number) {
    this.dashboardService.addItemToDashboard(recipeId).subscribe({
      next: () => {
        (this.toastr as any).success('Receta añadida al plan del día');
        this.cargarDatosDashboard(); // Recarga para actualizar barras de progreso
      },
      error: (err: any) => {
        if (err.status === 400) {
          (this.toastr as any).warning('Esta receta ya fue añadida'); // Escenario 2 HU-9
        }
      },
    });
  }

  // --- FUNCIONES DE NAVEGACIÓN INTACTAS ---
  toggleToDeporte() {
    this.router.navigate(['/dashboard/deporte']);
  }

  goToDietas() {
    this.router.navigate(['/dietas']);
  }

  // --- MÉTODOS ANTIGUOS COMENTADOS POR CONFLICTO CON LO NUEVO ---
  /*
  private fetchDietaData() {
    return this.dashboardService.getDietaDashboard();
  }

  private updateData(data: DietData) {
    // 1. Guard clause: If data is missing, don't execute to avoid "cannot read property of undefined"
    // if (!data || !data.dieta) {
    //  this.loading = false;
    //  return;
    // }

    // 2. Basic Info
    // this.userName = data.usuario?.nombre || 'Usuario';
    // this.caloriesGoal = data.dieta.calorias_objetivo;
    // this.caloriesAmount = data.dieta.calorias_totales;

    // 3. Macros 1 (Water/Fiber)
    // const m1 = data.dieta.macros1 || [];
    // this.waterAmount = m1[0]?.valor || '';
    // this.waterText = m1[0]?.nombre || '';
    // this.fiberAmount = m1[1]?.valor || '';
    // this.fiberText = m1[1]?.nombre || '';

    // 4. Macros 2 (Proteins/Fats/etc)
    // const m2 = data.dieta.macros2 || [];
    // this.proteinAmount = m2[0]?.valor || '';
    // this.proteinText = m2[0]?.nombre || '';
    // this.proteinProgress = m2[0]?.progreso || 0;

    // this.fatsAmount = m2[1]?.valor || '';
    // this.fatsText = m2[1]?.nombre || '';
    // this.fatsProgress = m2[1]?.progreso || 0;

    // this.carbsAmount = m2[2]?.valor || '';
    // this.carbsText = m2[2]?.nombre || '';
    // this.carbsProgress = m2[2]?.progreso || 0;

    // this.sodiumAmount = m2[3]?.valor || '';
    // this.sodiumText = m2[3]?.nombre || '';
    // this.sodiumProgress = m2[3]?.progreso || 0;

    // this.sugarAmount = m2[4]?.valor || '';
    // this.sugarText = m2[4]?.nombre || '';
    // this.sugarProgress = m2[4]?.progreso || 0;

    // 5. Recipes - Updating the list for your new @for loop
    // const recetas = data.dieta.recetas || [];

    // This updates the array we created for the @for loop in the previous step
    // this.dietItems = recetas.map((r, index) => ({
    //  id: index,
    //  text: r.nombre || `Receta ${index + 1}`,
    //  amount: r.valor || '',
    // }));

    // Keeping these legacy variables for now so the rest of the template doesn't break
    // this.dietAmount1 = recetas[0]?.valor || '';
    // this.dietText1 = recetas[0]?.nombre || '';
    // ...resto de variables de texto y cantides
    // this.loading = false;
    return;
  }

  // addToDashboard(id: number) {
  //   this.dietService.addToDashboard(id).subscribe({
  //     next: () => {
  //       this.toastr.success('¡Añadido con éxito!');
  //       this.loadDashboardData(); // Recarga las barras de progreso
  //     },
  //     error: (err) => {
  //       if (err.status === 400) {
  //         this.toastr.warning('Este elemento ya fue añadido'); // Escenario 2 de la HU
  //       }
  //     }
  //   });
  // }
  */
}
