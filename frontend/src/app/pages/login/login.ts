import { Component, inject, AfterViewInit, NgZone } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';

declare var google: any;

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [RouterLink, ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login implements AfterViewInit {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);
  private ngZone = inject(NgZone);
  private clientId = '26076707626-0opcaocg1dgbcj4g8fn0kaasigov1u4r.apps.googleusercontent.com';

  loginForm: FormGroup = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]],
  });

  isLoading = false;
  errorMessage = '';

  ngAfterViewInit(): void {
    // Retardo de seguridad
    setTimeout(() => {
      if (typeof google !== 'undefined' && google.accounts) {
        google.accounts.id.initialize({
          client_id: this.clientId,
          callback: this.handleGoogleResponse.bind(this),
        });

        // Asegúrate de que el ID coincida con el HTML ("google-btn")
        google.accounts.id.renderButton(document.getElementById('google-btn'), {
          type: 'icon', // Modo icono de Google (solo la G)
          shape: 'circle', // Forma circular
          theme: 'outline', // Fondo blanco con borde sutil, ideal para tu fondo gris
          size: 'large', // Tamaño óptimo para hacer clic
        });
      } else {
        console.error('El script de Google no se ha cargado correctamente en index.html');
      }
    }, 100);
  }

  handleGoogleResponse(response: any) {
    this.isLoading = true;
    this.authService.googleAuth(response.credential).subscribe({
      next: (res: any) => {
        console.log('Autenticación con Google exitosa');
        this.isLoading = false;

        this.ngZone.run(() => {
          // LA MAGIA ESTÁ AQUÍ: Evaluamos qué necesita el usuario
          if (res.needsOnboarding) {
            console.log('El usuario necesita completar sus datos biométricos');
            this.router.navigate(['/bio']); // Ruta a tu cuestionario
          } else {
            console.log('El usuario ya tiene todo completo');
            this.router.navigate(['/']); // Ruta principal / Dashboard
          }
        });
      },
      error: (err) => {
        this.isLoading = false;
        this.ngZone.run(() => {
          alert('Google Sign-In failed. Please try again.');
          this.errorMessage = 'Server error. Please try again later.';
        });
      },
    });
  }

  login() {
    if (this.loginForm.invalid) return;

    this.isLoading = true;
    this.errorMessage = '';

    this.authService.login(this.loginForm.value).subscribe({
      next: (res: any) => {
        console.log('Logged in!');
        this.isLoading = false;

        // Mismo control que en Google
        const userId = res.user.id;
        if (res.needsOnboarding) {
          this.router.navigate(['/bio'], {
            queryParams: { userId: userId },
          });
        } else {
          this.router.navigate(['/']);
        }
      },
      error: (err) => {
        this.isLoading = false;
        if (err.status === 401) {
          alert('Incorrect email or password');
          this.errorMessage = 'Incorrect email or password.';
        } else {
          alert('Server error. Please try again later.');
          this.errorMessage = 'Server error. Please try again later.';
        }
      },
    });
  }

  logout() {}
}
