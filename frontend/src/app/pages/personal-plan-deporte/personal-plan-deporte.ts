import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Exercises, PlanService } from '../../services/plan.service';

@Component({
  selector: 'app-personal-plan-deporte',
  imports: [CommonModule, RouterModule],
  templateUrl: './personal-plan-deporte.html',
  styleUrl: './personal-plan-deporte.css',
})
export class PersonalPlanDeporte implements OnInit {
  readonly NIVELES = ['Principiante', 'Intermedio', 'Avanzados'] as const;
  declare exercises: Exercises;

  constructor(
    private route: ActivatedRoute,
    private planService: PlanService,
    private router: Router,
    private cdr: ChangeDetectorRef,
  ) {}
  ngOnInit() {
    this.planService.getExercisesByLevel().subscribe({
      next: (data) => {
        this.exercises = data;
        this.cdr.detectChanges();
        console.log('Se ha obtenido tu plan personal de ejercicios:', this.exercises);
      },
      error: (err) => {
        console.error(
          'Ha ocurrido un error al intentar obtener tu plan personal de ejercicios:',
          err,
        );
      },
    });
  }

  volver() {
    this.router.navigate(['/dashboard/deporte']);
  }

  mover(direccion: number, momento: string, elemento: HTMLElement) {
    const desplazar = 320 * direccion;
    elemento.scrollBy({
      left: desplazar,
      behavior: 'smooth',
    });
  }
}
