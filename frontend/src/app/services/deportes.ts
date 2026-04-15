import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DeporteService {

  constructor() {}

  obtenerPlanDeportivo(): Observable<any[]> {
    const datasetTemporal = [
      {
        titulo: 'Fuerza y Tonificación',
        indiceActual: 0,
        ejercicios: [
          { id: '1', nombre: 'Flexiones Diamante', img: 'assets/img/ejercicio1.jpg', etiquetas: ['fuerza'] },
          { id: '2', nombre: 'Sentadillas con Peso', img: 'assets/img/ejercicio2.jpg', etiquetas: ['fuerza', 'equipo'] },
          { id: '3', nombre: 'Dominadas', img: 'assets/img/ejercicio3.jpg', etiquetas: ['fuerza'] }
        ]
      },
      {
        titulo: 'Cardio y Resistencia',
        indiceActual: 0,
        ejercicios: [
          { id: '4', nombre: 'HIIT 15 Minutos', img: 'assets/img/cardio1.jpg', etiquetas: ['cardio', 'tiempo'] },
          { id: '5', nombre: 'Saltos de Comba', img: 'assets/img/cardio2.jpg', etiquetas: ['cardio', 'equipo'] },
          { id: '6', nombre: 'Burpees', img: 'assets/img/cardio3.jpg', etiquetas: ['cardio'] }
        ]
      }
    ];
    return of(datasetTemporal);
  }

  obtenerEjercicioPorId(id: string | null): Observable<any> {
    const ejercicioMock = {
      id: id,
      nombre: 'Flexiones Diamante',
      imagen: 'assets/img/ejercicio1.jpg',
      duracion: '4 series de 12 reps',
      dificultad: 'Intermedio',
      etiquetas: ['fuerza', 'equipo'],
      videoUrl: 'https://www.youtube.com/embed/tu-video-id', //mirar si ahora funciona los videos
      musculos: [
        'Tríceps braquial',
        'Pectoral mayor',
        'Deltoides anterior',
        'Core (estabilización)'
      ],
      instrucciones: '1. Coloca las manos juntas formando un diamante con índices y pulgares.\n2. Mantén la espalda recta y el abdomen contraído.\n3. Baja controladamente hasta que el pecho roce las manos.\n4. Empuja con fuerza hacia arriba.'
    };
    return of(ejercicioMock);
  }
}
