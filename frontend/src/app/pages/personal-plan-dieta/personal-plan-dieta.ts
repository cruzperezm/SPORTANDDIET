import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { PlanService, Recipes } from '../../services/plan.service';
import { BehaviorSubject, Observable, switchMap } from 'rxjs';

@Component({
  selector: 'app-personal-plan-dieta',
  imports: [CommonModule, RouterModule],
  templateUrl: './personal-plan-dieta.html',
  styleUrl: './personal-plan-dieta.css',
})
export class PersonalPlanDieta implements OnInit {
  readonly MOMENTOS = ['Desayuno', 'Almuerzo', 'Cena'] as const;

  declare recipes: Recipes;

  constructor(
    private route: ActivatedRoute,
    private planService: PlanService,
    private location: Location,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit() {
    this.planService.getRecipesByMoment().subscribe({
      next: (data) => {
        this.recipes = data;
        this.cdr.detectChanges();
        console.log('Se ha obtenido tu plan personal de recetas:', this.recipes);
      },
      error: (err) => {
        console.error('Ha ocurrido un error al intentar obtener tu plan personal de recetas:', err);
      },
    });
  }

  volver() {
    this.location.back();
  }

  mover(direccion: number, momento: string, elemento: HTMLElement) {
    const desplazar = 320 * direccion;
    elemento.scrollBy({
      left: desplazar,
      behavior: 'smooth',
    });
  }
}
