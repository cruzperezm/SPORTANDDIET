import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { DeporteService } from '../../../services/deportes';

@Component({
  selector: 'app-deportes-plan',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './deportes-plan.html',
  styleUrl: './deportes-plan.css',
})
export class DeportesPlanComponent implements OnInit {
  deporte: any = null;
  filtrosActivos: string[] = [];
  indices: { [key: string]: number } = {};

  constructor(
    private route: ActivatedRoute,
    private deporteService: DeporteService,
    private location: Location,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit() {
    this.route.paramMap.subscribe((params) => {
      const id = params.get('id');
      if (id) {
        this.deporteService.obtenerPlanPorId(id).subscribe({
          next: (data: any) => {
            this.deporte = data;
            if (this.deporte && this.deporte.plan) {
              this.indices = {};
              this.deporte.plan.forEach((fase: any) => {
                this.indices[fase.nivel] = 0;
              });
              this.cdr.detectChanges();
            }
          },
        });
      }
    });
  }

  volver() {
    this.location.back();
  }

  toggleFiltro(tipo: string) {
    if (tipo === 'todos') this.filtrosActivos = [];
    else {
      this.filtrosActivos.includes(tipo)
        ? (this.filtrosActivos = this.filtrosActivos.filter((f) => f !== tipo))
        : this.filtrosActivos.push(tipo);
    }
    Object.keys(this.indices).forEach((k) => (this.indices[k] = 0));
    this.cdr.detectChanges();
  }

  getEjerciciosFiltrados(fase: any): any[] {
    if (!fase?.ejercicios) return [];
    if (this.filtrosActivos.length === 0) return fase.ejercicios;
    // Filtramos por material o categoría (mancuernas, cardio, etc)
    return fase.ejercicios.filter((e: any) =>
      this.filtrosActivos.every((f) => e.filtros.includes(f)),
    );
  }

  getEjerciciosVisibles(fase: any): any[] {
    const filtrados = this.getEjerciciosFiltrados(fase);
    const total = filtrados.length;
    if (total === 0) return [];
    if (total <= 3) return filtrados;
    const i = this.indices[fase.momento] || 0;
    return [filtrados[i % total], filtrados[(i + 1) % total], filtrados[(i + 2) % total]];
  }

  mover(paso: number, nivel: string) {
    const fase = this.deporte.plan.find((f: any) => f.nivel === nivel);
    const total = this.getEjerciciosFiltrados(fase).length;
    if (total <= 3) return;
    this.indices[nivel] = (this.indices[nivel] + paso + total) % total;
    this.cdr.detectChanges();
  }
}
