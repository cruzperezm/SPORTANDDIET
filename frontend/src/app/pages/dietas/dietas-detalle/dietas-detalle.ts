import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { DietService } from '../../../services/dietas.service';
import { DashboardService } from '../../../services/dashboard.service';

@Component({
  selector: 'app-dieta-detalle',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './dietas-detalle.html',
  styleUrl: './dietas-detalle.css',
})
export class DietasDetalleComponent implements OnInit {
  recetaId: string | null = null;
  receta: any = null;

  hasRecipe: boolean = false;

  reList: any[] = [];

  constructor(
    private route: ActivatedRoute,
    private dietasService: DietService,
    private dashboardService: DashboardService,
    private location: Location,
    private cdr: ChangeDetectorRef, // Importante para refrescar la vista
  ) {}

  ngOnInit() {
    // Usamos paramMap para que funcione siempre, incluso al recargar
    this.route.paramMap.subscribe((params) => {
      this.recetaId = params.get('id');
      if (this.recetaId) {
        this.cargarReceta(this.recetaId);
      }
    });
  }

  cargarReceta(id: string) {
    this.dietasService.getRecipeById(id).subscribe({
      next: (data) => {
        this.receta = data;
        this.hasRecipe = this.inList();
        this.cdr.detectChanges();
      },
      error: (err) => console.error('Error al cargar detalle:', err),
    });
  }

  volverAtras(event: Event) {
    event.preventDefault();
    this.location.back();
  }

  guardar(){
    const x = localStorage.getItem("Dietas");
    if ( x != null){
      this.reList = JSON.parse(x);
    }
    if (this.recetaId != null) {
      try {
        this.dashboardService.addFavoriteRecipe(parseInt(this.recetaId)).subscribe();
      } catch(err) {
        console.log(err);
      }
    }
    this.reList.push(this.receta);
    localStorage.setItem("Dietas", JSON.stringify(this.reList));
    this.hasRecipe = true;
  }

  eliminar(){
    const x = localStorage.getItem("Dietas");
    if ( x != null){
      this.reList = JSON.parse(x);
    }
    const elem = this.reList.find((val) => val.id === this.receta.id)
    const i = this.reList.indexOf(elem);
    this.reList.splice(i, 1);
    localStorage.setItem("Dietas", JSON.stringify(this.reList));
    this.hasRecipe = false;
  }

  inList() {
    const x = localStorage.getItem("Dietas");
    if ( x != null){
      this.reList = JSON.parse(x);
    }
    const elem = this.reList.find((val) => val.id === this.receta.id)
    const i = this.reList.indexOf(elem);
    return i!=-1;
  }
}
