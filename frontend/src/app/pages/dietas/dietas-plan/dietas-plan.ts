import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { DietaService } from '../../../services/dietas';

@Component({
  selector: 'app-dieta-plan',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './dietas-plan.html',
  styleUrl: './dietas-plan.css',
})
export class DietaPlanComponent implements OnInit {
  dietaId: string | null = null;
  categoriasDieta: any[] = [];

  constructor(
    private route: ActivatedRoute,
    private dietasService: DietaService,
  ) {}

  ngOnInit() {
    this.dietaId = this.route.snapshot.paramMap.get('id');

    this.dietasService.obtenerPlanPorDieta(this.dietaId).subscribe((datos: any) => {
      console.log('DATOS RECIBIDOS:', datos);
      this.categoriasDieta = datos;
    });
  }

  getPlatosVisibles(categoria: any) {
    if (!categoria.platos || categoria.platos.length === 0) return [];

    const total = categoria.platos.length;
    const i = categoria.indiceActual || 0;

    // Si hay menos de 3 platos, mostramos solo los que hay
    if (total < 3) return categoria.platos;

    return [
      categoria.platos[i % total],
      categoria.platos[(i + 1) % total],
      categoria.platos[(i + 2) % total],
    ];
  }

  mover(direccion: number, categoria: any) {
    if (!categoria.platos) return;
    const total = categoria.platos.length;
    if (total === 0) return;

    if (direccion === 1) {
      categoria.indiceActual = (categoria.indiceActual + 1) % total;
    } else {
      categoria.indiceActual = (categoria.indiceActual - 1 + total) % total;
    }
  }
}
