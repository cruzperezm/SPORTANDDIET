import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { DietService } from '../../../services/dietas.service';
import { BehaviorSubject, Observable, switchMap } from 'rxjs';

@Component({
  selector: 'app-dietas-plan',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './dietas-plan.html',
  styleUrl: './dietas-plan.css',
})
export class DietasPlanComponent implements OnInit {
  readonly MOMENTOS = ['Desayuno', 'Almuerzo', 'Cena'] as const;
  readonly LISTA_ALERGENOS = [
    { valor: 'gluten', etiqueta: 'Sin Gluten' },
    { valor: 'lacteos', etiqueta: 'Sin Lácteos' },
    { valor: 'huevos', etiqueta: 'Sin Huevos' },
    { valor: 'pescado', etiqueta: 'Sin Pescado' },
    { valor: 'frutos_secos', etiqueta: 'Sin Frutos Secos' },
    { valor: 'soja', etiqueta: 'Sin Soja' },
    { valor: 'cacahuete', etiqueta: 'Sin Cacahuete' },
    { valor: 'sesamo', etiqueta: 'Sin Sésamo' },
    { valor: 'crustaceos', etiqueta: 'Sin Crustáceos' },
  ];

  recipes$!: Record<string, Observable<any[]>>;
  filtros$!: Observable<string[]>;

  // Variables de estado
  dieta: any = null;
  idDieta: string | null = null;
  filtrosActivos: string[] = [];
  indices: { [key: string]: number } = {};

  constructor(
    private route: ActivatedRoute,
    private dietaService: DietService,
    private location: Location,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit() {
    // Escuchamos cambios en la URL (importante para recargas con F5)
    this.route.paramMap.subscribe((params) => {
      this.idDieta = params.get('id');

      if (this.idDieta) {
        this.dietaService.getDietById(this.idDieta).subscribe({
          next: (data) => {
            console.log('Receta encontrada:', data);
            this.dieta = data;
            this.cdr.detectChanges();
          },
          error: (err) => console.error('Error al cargar dieta:', err),
        });
        this.cargarDatos(this.idDieta);
      }
    });
    this.filtros$ = this.dietaService.filtrosActivos$;
    this.filtrosActivos = this.dietaService.getFiltrosActuales();
  }

  cargarDatos(id: string) {
    this.recipes$ = {
      Desayuno: this.crearFlujoFiltrado(id, 'DESAYUNO'),
      Almuerzo: this.crearFlujoFiltrado(id, 'ALMUERZO'),
      Cena: this.crearFlujoFiltrado(id, 'CENA'),
    };
  }

  volver() {
    this.location.back();
  }

  private crearFlujoFiltrado(id: string, momento: string) {
    return this.dietaService.filtrosActivos$.pipe(
      switchMap((tags) => {
        if (tags.length === 0) {
          return this.dietaService.getRecipesByMoment(id, momento);
        }

        return this.dietaService.filter(id, tags, momento);
      }),
    );
  }

  toggleFiltro(tipo: string) {
    if (tipo === 'todos') {
      this.filtrosActivos = [];
    } else {
      if (this.filtrosActivos.includes(tipo)) {
        this.filtrosActivos = this.filtrosActivos.filter((f) => f !== tipo);
      } else {
        this.filtrosActivos.push(tipo);
      }
    }
    this.dietaService.setFiltros(this.filtrosActivos);
  }

  mover(direccion: number, momento: string, elemento: HTMLElement) {
    const desplazar = 320 * direccion;
    elemento.scrollBy({
      left: desplazar,
      behavior: 'smooth',
    });
  }
}
