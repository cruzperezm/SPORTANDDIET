import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router'; // Importante para que funcionen tus botones
import { AuthService } from '../../../services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent {
  authService = inject(AuthService)

  isLoggedIn$ = this.authService.isLoggedIn$;
}
