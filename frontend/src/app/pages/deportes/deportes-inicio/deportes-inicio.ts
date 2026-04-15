import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-deportes-inicio',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './deportes-inicio.html',
  styleUrl: './deportes-inicio.css',
})
export class DeportesInicioComponent {
  disciplinas = [
    { id: 1, nombre: 'Fuerza', imagen: 'assets/img/fuerza.jpg' },
    { id: 2, nombre: 'Cardio', imagen: 'assets/img/cardio.jpg' },
    { id: 3, nombre: 'Flexibilidad', imagen: 'assets/img/flex.jpg' },
    { id: 4, nombre: 'Calistenia', imagen: 'assets/img/calistenia.jpg' },
    { id: 5, nombre: 'HIIT', imagen: 'assets/img/hiit.jpg' },
    { id: 6, nombre: 'Pilates', imagen: 'assets/img/pilates.jpg' },
  ];

  constructor(private router: Router) {}

  irAlPlan() {
    this.router.navigate(['/deporte/plan']);
  }
}
