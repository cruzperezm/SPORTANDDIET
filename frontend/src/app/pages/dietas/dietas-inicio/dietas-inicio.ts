import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { DietService } from '../../../services/dietas.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-dietas-inicio',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dietas-inicio.html',
  styleUrl: './dietas-inicio.css',
})
export class DietasInicioComponent implements OnInit {
  //variables del buscador
  modoBusqueda: boolean = false;
  resultados$!: Observable<any[]>;
  textoBusqueda: string = '';

  //grid inicial
  dietas$!: Observable<any[]>;

  constructor(
    private router: Router,
    private dietaService: DietService,
  ) {}

  ngOnInit() {
    this.dietas$ = this.dietaService.getAllDiets();
  }

  //navegación original a los planes -
  irAlPlan(id: number) {
    console.log('Intentando navegar al ID:', id);
    this.router.navigate(['/dietas/plan', id]);
  }

  //logica del buscador simple
  onBuscar(event: any) {
    this.textoBusqueda = event.target.value;

    //solo inicia la búsqueda si escribe más de 2 letras
    if (this.textoBusqueda.length > 2) {
      this.modoBusqueda = true;

      this.resultados$ = this.dietaService.search(this.textoBusqueda);
    } else {
      //si se borra el texto o hay menos de 3 letras, apagamos el buscador
      this.modoBusqueda = false;
      this.resultados$ = new Observable<any[]>();
    }
  }

  limpiarBusqueda() {
    this.textoBusqueda = '';
    this.modoBusqueda = false;
    this.resultados$ = new Observable<any[]>();
  }

  //para navegar a la receta desde el buscador
  irAReceta(id: string) {
    this.router.navigate(['/dietas/receta', id]);
  }
}
