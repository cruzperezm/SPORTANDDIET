import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { DeporteService } from '../../../services/deportes';

@Component({
  selector: 'app-deporte-plan',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './deportes-plan.html',
  styleUrl: './deportes-plan.css'
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

    this.deporteService.obtenerPlanDeportivo(this.planId).subscribe({
      next: (datos: any) => {
        // Inicializamos el indiceActual para cada categoría si no viene en el JSON
        this.categoriasDeporte = datos.map((cat: any) => ({
          ...cat,
          indiceActual: 0
        }));
      },
      error: (err) => console.error("Error en deportes:", err)
    });
  }

  // ESTA ES LA FUNCIÓN QUE EL HTML ESTÁ BUSCANDO
  getEjerciciosVisibles(categoria: any) {
    const ejercicios = categoria.ejercicios || [];
    const total = ejercicios.length;

    if (total === 0) return [];

    const i = categoria.indiceActual || 0;

    // Si hay 3 o menos, los mostramos todos sin rotar
    if (total <= 3) return ejercicios;

    // Lógica circular para el carrusel
    return [
      ejercicios[i % total],
      ejercicios[(i + 1) % total],
      ejercicios[(i + 2) % total]
    ];
  }

  // Función para mover las flechas
  mover(direccion: number, categoria: any) {
    const ejercicios = categoria.ejercicios || [];
    const total = ejercicios.length;

    if (total === 0) return;

    // Sumamos el total para evitar números negativos al ir hacia atrás
    categoria.indiceActual = (categoria.indiceActual + direccion + total) % total;
  }
}
