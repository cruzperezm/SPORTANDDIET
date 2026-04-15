import { Component, OnInit } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { DietasService } from '../../../services/dietas';

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
    private dietasService: DietasService,
    private location: Location
  ) {}

  ngOnInit() {
    this.recetaId = this.route.snapshot.paramMap.get('id');
    this.dietasService.obtenerRecetaPorId(this.recetaId).subscribe(data => {
      this.receta = data;
    });
  }

  // 3. AÑADE ESTA FUNCIÓN
  volverAtras(event: Event) {
    event.preventDefault();
    this.location.back();
  }
}
