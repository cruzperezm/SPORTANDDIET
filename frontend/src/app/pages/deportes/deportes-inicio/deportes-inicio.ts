import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { SportService } from '../../../services/deportes.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-deportes-inicio',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './deportes-inicio.html',
  styleUrl: './deportes-inicio.css',
})
export class DeportesInicioComponent implements OnInit {
  //variables del Buscador
  modoBusqueda: boolean = false;
  resultados$!: Observable<any[]>;
  textoBusqueda: string = '';

  planes$!: Observable<any[]>;

  constructor(
    private router: Router,
    private deporteService: SportService,
  ) {}

  ngOnInit() {
    this.planes$ = this.deporteService.getAllPlans();
  }

  irAlPlan(id: number) {
    this.router.navigate(['/deportes/plan', id]);
  }

  //metodos del buscador
  onBuscar(event: any) {
    this.textoBusqueda = event.target.value;

    if (this.textoBusqueda.length > 2) {
      this.modoBusqueda = true;
      this.resultados$ = this.deporteService.search(this.textoBusqueda);
    } else {
      this.modoBusqueda = false;
      this.resultados$ = new Observable<any[]>();
    }
  }

  limpiarBusqueda() {
    this.textoBusqueda = '';
    this.modoBusqueda = false;
    this.resultados$ = new Observable<any[]>();
  }

  irAEjercicio(id: string) {
    this.router.navigate(['/deportes/ejercicio', id]);
  }
}
