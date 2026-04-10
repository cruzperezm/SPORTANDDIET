import { Component, ElementRef, ViewChild, AfterViewInit } from "@angular/core";

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent implements AfterViewInit {

  @ViewChild('miVideo') videoElement!: ElementRef<HTMLVideoElement>;

  ngAfterViewInit() {
    // Le damos un pequeñísimo respiro al navegador con setTimeout
    // Esto asegura que Angular haya terminado de pintar completamente el HTML
    setTimeout(() => {
      if (this.videoElement && this.videoElement.nativeElement) {
        const video = this.videoElement.nativeElement;

        // ¡LA CLAVE! Forzamos el muteado directamente en el objeto del navegador
        video.muted = true;

        // Ahora sí, intentamos reproducir
        video.play().catch(error => {
          console.log("El navegador sigue bloqueando el autoplay:", error);
        });
      }
    }, 100); // 100 milisegundos de espera
  }
}
