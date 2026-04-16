import { Component, OnInit } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { DietaService } from '../../../services/dietas';

@Component({
  selector: 'app-dieta-detalle',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './dietas-detalle.html',
  styleUrl: './dietas-detalle.css'
})
export class DietaDetalleComponent implements OnInit {
  recetaId: string | null = '';
  receta: any = null;

  constructor(
    private route: ActivatedRoute,
    private dietasService: DietaService,
    private location: Location
  ) {}

  ngOnInit() {
    this.recetaId = this.route.snapshot.paramMap.get('id');
    this.dietasService.obtenerRecetaPorId(this.recetaId).subscribe((data: any) => {
      this.receta = data;
      console.log('Receta cargada:', this.receta);
    });
  }

  volverAtras(event: Event) {
    event.preventDefault();
    this.location.back();
  }
}
