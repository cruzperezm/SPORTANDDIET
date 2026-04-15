import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
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

  constructor(private deporteService: DeporteService) {}

  ngOnInit() {
    this.deporteService.obtenerPlanDeportivo().subscribe((datos) => {
      this.categoriasDeporte = datos;
    });
  }

  getEjerciciosVisibles(categoria: any) {
    const total = categoria.ejercicios.length;
    if (total === 0) return [];
    return [
      categoria.ejercicios[categoria.indiceActual % total],
      categoria.ejercicios[(categoria.indiceActual + 1) % total],
      categoria.ejercicios[(categoria.indiceActual + 2) % total],
    ];
  }

  mover(direccion: number, categoria: any) {
    const total = categoria.ejercicios.length;
    if (direccion === 1) {
      categoria.indiceActual = (categoria.indiceActual + 1) % total;
    } else {
      categoria.indiceActual = (categoria.indiceActual - 1 + total) % total;
    }
  }
}
