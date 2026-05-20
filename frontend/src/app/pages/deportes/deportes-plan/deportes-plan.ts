import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { SportService } from '../../../services/deportes.service';
import { AuthService } from '../../../services/auth.service';
import { Observable, switchMap } from 'rxjs';

@Component({
  selector: 'app-deportes-plan',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './deportes-plan.html',
  styleUrl: './deportes-plan.css',
})
export class DeportesPlanComponent implements OnInit {
  readonly NIVELES = ['Principiante', 'Intermedio', 'Avanzados'] as const;
  readonly LISTA_FILTROS = [
    // General / Cardio
    { valor: 'Cardio', etiqueta: 'Cardio' },
    { valor: 'Core', etiqueta: 'Core' },
    { valor: 'Abdominales', etiqueta: 'Abdominales' },

    // Tren Superior
    { valor: 'Pecho', etiqueta: 'Pecho' },
    { valor: 'Pectorales', etiqueta: 'Pectorales' },
    { valor: 'Espalda', etiqueta: 'Espalda' },
    { valor: 'Espalda_alta', etiqueta: 'Espalda Alta' },
    { valor: 'Dorsales', etiqueta: 'Dorsales' },
    { valor: 'Trapecios', etiqueta: 'Trapecios' },
    { valor: 'Hombros', etiqueta: 'Hombros' },
    { valor: 'Deltoides', etiqueta: 'Deltoides' },
    { valor: 'Brazos', etiqueta: 'Brazos' },
    { valor: 'Biceps', etiqueta: 'Bíceps' },
    { valor: 'Triceps', etiqueta: 'Tríceps' },
    { valor: 'Antebrazos', etiqueta: 'Antebrazos' },

    // Tren Inferior
    { valor: 'Piernas', etiqueta: 'Piernas' },
    { valor: 'Gluteos', etiqueta: 'Glúteos' },
    { valor: 'Cuadriceps', etiqueta: 'Cuádriceps' },
    { valor: 'Isquiotibiales', etiqueta: 'Isquiotibiales' },
    { valor: 'Gemelos', etiqueta: 'Gemelos' },
    { valor: 'Aductores', etiqueta: 'Aductores' },

    // Otros
    { valor: 'Cuello', etiqueta: 'Cuello' },
    { valor: 'Columna', etiqueta: 'Columna' },
  ];

  exercises$!: Record<string, Observable<any[]>>;
  filtros$!: Observable<string[]>;

  plan: any = null;
  idPlan: string | null = null;
  filtrosActivos: string[] = [];
  indices: { [key: string]: number } = {};

  constructor(
    private route: ActivatedRoute,
    private deporteService: SportService,
    private location: Location,
    private cdr: ChangeDetectorRef,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.filtros$ = this.deporteService.filtrosActivos$;
    this.deporteService.filtrosActivos$.subscribe((filters) => {
      this.filtrosActivos = filters;
      this.cdr.detectChanges();
    });

    this.authService.userProfile$.subscribe({
      next: (profile) => {
        if (profile && profile.muscleGroups) {
          this.deporteService.setFiltros(profile.muscleGroups);
        }
      }
    });

    this.route.paramMap.subscribe((params) => {
      this.idPlan = params.get('id');

      if (this.idPlan) {
        this.deporteService.getPlanById(this.idPlan).subscribe({
          next: (data) => {
            console.log('Plan encontrado:', data);
            this.plan = data;
            this.cdr.detectChanges();
          },
          error: (err) => console.error('Error al cargar plan:', err),
        });
        this.cargarDatos(this.idPlan);
      }
    });
  }

  cargarDatos(id: string) {
    this.exercises$ = {
      Principiante: this.crearFlujoFiltrado(id, 'PRINCIPIANTE'),
      Intermedio: this.crearFlujoFiltrado(id, 'INTERMEDIO'),
      Avanzados: this.crearFlujoFiltrado(id, 'AVANZADOS'),
    };
  }

  volver() {
    this.location.back();
  }

  private crearFlujoFiltrado(id: string, nivel: string) {
    return this.deporteService.filtrosActivos$.pipe(
      switchMap((tags) => {
        if (tags.length === 0) {
          return this.deporteService.getExercisesByLevel(id, nivel);
        }

        return this.deporteService.filter(id, tags, nivel);
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
    this.deporteService.setFiltros(this.filtrosActivos);
  }

  mover(direccion: number, momento: string, elemento: HTMLElement) {
    const desplazar = 320 * direccion;
    elemento.scrollBy({
      left: desplazar,
      behavior: 'smooth',
    });
  }
}
