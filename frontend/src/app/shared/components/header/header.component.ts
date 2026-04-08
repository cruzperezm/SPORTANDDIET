import { Component } from '@angular/core';
import { RouterLink } from '@angular/router'; // Importante para que funcionen tus botones

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent {}
