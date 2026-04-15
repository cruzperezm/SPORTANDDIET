import { Component, OnInit } from '@angular/core';
import { CommonModule, Location } from '@angular/common'; // Importamos Location para volver
import { ActivatedRoute } from '@angular/router';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser'; // ¡La llave mágica para el vídeo!
import { DeporteService } from '../../../services/deportes';

@Component({
  selector: 'app-deportes-detalle',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './deportes-detalle.html',
  styleUrl: './deportes-detalle.css'
})
export class DeportesDetalleComponent implements OnInit {
  ejercicioId: string | null = '';
  ejercicio: any = null;
  videoSeguro: SafeResourceUrl | null = null;

  constructor(
    private route: ActivatedRoute,
    private deporteService: DeporteService,
    private location: Location,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit() {
    this.ejercicioId = this.route.snapshot.paramMap.get('id');

    this.deporteService.obtenerEjercicioPorId(this.ejercicioId).subscribe(data => {
      this.ejercicio = data;

      if (this.ejercicio.videoUrl) {
        this.videoSeguro = this.sanitizer.bypassSecurityTrustResourceUrl(this.ejercicio.videoUrl);
      }
    });
  }

  volverAtras(event: Event) {
    event.preventDefault();
    this.location.back();
  }
}
