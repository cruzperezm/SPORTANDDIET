import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { DietasService } from '../../../services/dietas';

@Component({
  selector: 'app-dieta-plan',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './dietas-plan.html',
  styleUrl: './dietas-plan.css'
})
export class DietaPlanComponent implements OnInit {
  dietaId: string | null = '';

  categoriasComida: any[] = [];

  constructor(
    private route: ActivatedRoute,
    private dietasService: DietasService
  ) {}

  ngOnInit() {
    this.dietaId = this.route.snapshot.paramMap.get('id');

    // 4. Pedimos los datos al servicio al cargar la página
    this.dietasService.obtenerPlanPorDieta(this.dietaId).subscribe((datos) => {
      this.categoriasComida = datos;
    });
  }

  getPlatosVisibles(categoria: any) {
    const total = categoria.platos.length;
    return [
      categoria.platos[categoria.indiceActual % total],
      categoria.platos[(categoria.indiceActual + 1) % total],
      categoria.platos[(categoria.indiceActual + 2) % total]
    ];
  }

  mover(direccion: number, categoria: any) {
    const total = categoria.platos.length;
    if (direccion === 1) {
      categoria.indiceActual = (categoria.indiceActual + 1) % total;
    } else {
      categoria.indiceActual = (categoria.indiceActual - 1 + total) % total;
    }
  }
}
