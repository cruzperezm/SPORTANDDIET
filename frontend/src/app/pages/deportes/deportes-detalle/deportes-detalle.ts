import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { SportService } from '../../../services/deportes.service';

@Component({
  selector: 'app-deportes-detalle',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './deportes-detalle.html',
  styleUrl: './deportes-detalle.css',
})
export class DeportesDetalleComponent implements OnInit {
  exerciseId: string | null = null;
  exercise: any = null;
  tipoVista: 'plan' | 'ejercicio' | null = null; // <- Añadimos esta variable

  constructor(
    private route: ActivatedRoute,
    private deporteService: SportService,
    private location: Location,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit() {
    this.route.paramMap.subscribe((params) => {
      this.exerciseId = params.get('id');
      if (this.exerciseId) {
        this.cargarDatos(this.exerciseId);
      }
    });
  }

  cargarDatos(id: string) {
    this.deporteService.getExerciseById(id).subscribe({
      next: (data: any) => {
        this.exercise = data;
        this.cdr.detectChanges();
      },
      error: (err) => console.error('Error al cargar:', err),
    });
  }

  volver() {
    this.location.back();
  }
}
