import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router'; // Importante para que funcionen tus botones

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent {}
