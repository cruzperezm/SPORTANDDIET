import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DietasService {
  constructor() {}

  obtenerPlanPorDieta(id: string | null): Observable<any[]> {
    const datasetTemporal = [
      {
        titulo: 'Desayunos',
        indiceActual: 0,
        platos: [
          { nombre: 'Tortilla de Espinacas', img: 'assets/img/desayuno1.jpg' },
          { nombre: 'Smoothie Bowl', img: 'assets/img/desayuno2.jpg' },
          { nombre: 'Tostada de Aguacate', img: 'assets/img/desayuno3.jpg' },
          { nombre: 'Avena con Frutos Rojos', img: 'assets/img/desayuno4.jpg' },
        ],
      },
      {
        titulo: 'Almuerzos',
        indiceActual: 0,
        platos: [
          { nombre: 'Ensalada de Quinoa', img: 'assets/img/almuerzo1.jpg' },
          { nombre: 'Pollo al Horno', img: 'assets/img/almuerzo2.jpg' },
          { nombre: 'Salmón a la Plancha', img: 'assets/img/almuerzo3.jpg' },
          { nombre: 'Pasta Integral', img: 'assets/img/almuerzo4.jpg' },
        ],
      },
      {
        titulo: 'Cenas',
        indiceActual: 0,
        platos: [
          { nombre: 'Crema de Calabaza', img: 'assets/img/cena1.jpg' },
          { nombre: 'Pescado Blanco', img: 'assets/img/cena2.jpg' },
          { nombre: 'Revuelto de Setas', img: 'assets/img/cena3.jpg' },
          { nombre: 'Ensalada Ligera', img: 'assets/img/cena4.jpg' },
        ],
      },
    ];

    return of(datasetTemporal);
  }
  obtenerRecetaPorId(id: string | null): Observable<any> {
    const recetaMock = {
      id: id,
      nombre: 'Tortilla de Espinacas',
      imagen: 'assets/img/desayuno1.jpg',
      tiempo: '15 min',
      calorias: '320 kcal',
      alergenos: ['huevos', 'lacteos'], // Sirve para mostrar los iconos
      ingredientes: [
        '3 Huevos camperos',
        '100g de Espinacas frescas',
        '1 cucharada de Aceite de Oliva Extra Virgen',
        'Sal y pimienta al gusto',
        'Opcional: 20g de queso feta',
      ],
      macros: {
        proteinas: '24g',
        grasas: '22g',
        carbos: '4g',
      },
      instrucciones:
        '1. Bate los huevos en un bol grande.\n2. Saltea las espinacas en una sartén con el aceite hasta que reduzcan.\n3. Añade los huevos batidos y cocina a fuego medio durante 3 minutos por cada lado.\n4. Sirve caliente y añade el queso por encima.',
    };

    return of(recetaMock);
  }
}
