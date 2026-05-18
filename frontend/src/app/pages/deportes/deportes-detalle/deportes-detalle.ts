import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { SportService } from '../../../services/deportes.service';

@Component({
  selector: 'app-deportes-detalle',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './deportes-detalle.html',
  styleUrl: './deportes-detalle.css',
})
export class DeportesDetalleComponent implements OnInit {
  exerciseId: string | null = null;
  exercise: any = null;
  tipoVista: 'plan' | 'ejercicio' | null = null; // <- Añadimos esta variable
  hasExercise: boolean = false;

  exList: any[] = [];

  constructor(
    private route: ActivatedRoute,
    private deporteService: SportService,
    private location: Location,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit() {
    this.route.paramMap.subscribe((params) => {
      this.exerciseId = params.get('id');
      if (this.exerciseId) {
        this.cargarDatos(this.exerciseId);
      }
    });
  }

  cargarDatos(id: string) {
    this.deporteService.getExerciseById(id).subscribe({
      next: (data: any) => {
        this.exercise = data;
        this.hasExercise = this.inList();
        this.cdr.detectChanges();
      },
      error: (err) => console.error('Error al cargar:', err),
    });
  }

  volver() {
    this.location.back();
  }

  guardar(){
    const x = localStorage.getItem("Deportes");
    if ( x != null){
      this.exList = JSON.parse(x);
    }
    this.exList.push(this.exercise);
    localStorage.setItem("Deportes", JSON.stringify(this.exList));
    this.hasExercise = true;
  }

  eliminar(){
    const x = localStorage.getItem("Deportes");
    if ( x != null){
      this.exList = JSON.parse(x);
    }
    const elem = this.exList.find((val) => val.toString() == this.exercise.toString())
    const i = this.exList.indexOf(elem);
    this.exList.splice(i, 1);
    localStorage.setItem("Deportes", JSON.stringify(this.exList));
    this.hasExercise = false;
  }

  inList() {
    const x = localStorage.getItem("Deportes");
    if ( x != null){
      this.exList = JSON.parse(x);
    }
    const elem = this.exList.find((val) => val.toString() == this.exercise.toString())
    const i = this.exList.indexOf(elem);
    return i!=-1;
  }
}
