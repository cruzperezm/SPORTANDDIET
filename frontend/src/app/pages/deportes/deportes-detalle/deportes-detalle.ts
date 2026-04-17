import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { DeporteService } from '../../../services/deportes';

@Component({
  selector: 'app-deportes-detalle',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './deportes-detalle.html',
  styleUrl: './deportes-detalle.css'
})
export class DeportesDetalleComponent implements OnInit {
  ejercicioId: string | null = null;
  ejercicio: any = null;

  constructor(
    private route: ActivatedRoute,
    private deporteService: DeporteService,
    private location: Location,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      this.ejercicioId = params.get('id');
      if (this.ejercicioId) {
        this.cargarEjercicio(this.ejercicioId);
      }
    });
  }

  cargarEjercicio(id: string) {
    this.deporteService.obtenerEjercicioPorId(id).subscribe({
      next: (data: any) => {
        this.ejercicio = data;
        this.cdr.detectChanges();
      },
      error: (err) => console.error("Error al cargar ejercicio:", err)
    });
  }

  volver() {
    this.location.back();
  }
}
