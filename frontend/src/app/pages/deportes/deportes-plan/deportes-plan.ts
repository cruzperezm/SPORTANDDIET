import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { DeporteService } from '../../../services/deportes';

@Component({
  selector: 'app-deporte-plan',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './deportes-plan.html',
  styleUrl: './deportes-plan.css',
})
export class DeportePlanComponent implements OnInit {
  categoriasDeporte: any[] = [];
  planId: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private deporteService: DeporteService
  ) {}

  ngOnInit() {
    this.planId = this.route.snapshot.paramMap.get('id');
    this.deporteService.obtenerPlanDeportivo(this.planId).subscribe((datos) => {
      this.categoriasDeporte = datos;
    });
  }

  getEjerciciosVisibles(categoria: any) {
    if (!categoria || !categoria.ejercicios || categoria.ejercicios.length === 0) {
      return [];
    }
    const lista = categoria.ejercicios;
    const total = lista.length;
    const i = categoria.indiceActual || 0;
    if (total < 3) {
      return lista;
    }
    return [
      lista[i % total],
      lista[(i + 1) % total],
      lista[(i + 2) % total],
    ];
  }

  mover(direccion: number, categoria: any) {
    if (!categoria.ejercicios) return;
    const total = categoria.ejercicios.length;
    if (total === 0) return;

    if (direccion === 1) {
      categoria.indiceActual = (categoria.indiceActual + 1) % total;
    } else {
      categoria.indiceActual = (categoria.indiceActual - 1 + total) % total;
    }
  }
}
