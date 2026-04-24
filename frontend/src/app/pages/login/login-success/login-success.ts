import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-login-success',
  standalone: true,
  template: '<h2>Autenticando de forma segura...</h2>'
})
export class LoginSuccessComponent implements OnInit {

  constructor(private route: ActivatedRoute, private router: Router) {}

  ngOnInit(): void {
    // 1. Atrapamos los parámetros de la URL
    this.route.queryParams.subscribe(params => {
      const token = params['token'];

      if (token) {
        // 2. Si hay token, lo guardamos (ej: en localStorage)
        localStorage.setItem('auth_token', token);

        // 3. Redirigimos al usuario a la página principal o Dashboard
        this.router.navigate(['/dashboard']);
      } else {
        // Si algo falla y no hay token, lo devolvemos al login
        this.router.navigate(['/login']);
      }
    });
  }
}
