import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dietas-inicio',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dietas-inicio.html',
  styleUrl: './dietas-inicio.css',
})
export class DietasInicioComponent {
  //cuadrícula
  dietas = [
    { id: 1, nombre: 'Dieta Keto', imagen: 'assets/img/keto.jpg' },
    { id: 2, nombre: 'Dieta Vegana', imagen: 'assets/img/vegana.jpg' },
    { id: 3, nombre: 'Mediterránea', imagen: 'assets/img/mediterranea.jpg' },
    { id: 4, nombre: 'Ayuno Intermitente', imagen: 'assets/img/ayuno.jpg' },
    { id: 5, nombre: 'Sin Gluten', imagen: 'assets/img/singluten.jpg' },
    { id: 6, nombre: 'Paleo', imagen: 'assets/img/paleo.jpg' },
  ];

  constructor(private router: Router) {}

  irAlPlan(id: number) {
    console.log('Intentando navegar al ID:', id);
    this.router.navigate(['/dietas/plan', id]);
  }
}
