import { Component, inject, AfterViewInit, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';

declare var google: any;

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './signup.html',
  styleUrl: './signup.css',
})
export class Signup implements AfterViewInit {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);
  private ngZone = inject(NgZone);
  private clientId = '26076707626-0opcaocg1dgbcj4g8fn0kaasigov1u4r.apps.googleusercontent.com';

  signUpForm: FormGroup = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    username: ['', [Validators.required]],
    password: ['', [Validators.required]],
    confirmPassword: ['', [Validators.required]],
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
            const userId = res.user.id;
            console.log('El usuario necesita completar sus datos biométricos');
            this.router.navigate(['/bio'], {
              queryParams: { userId: userId },
            });
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

  signup() {
    if (this.signUpForm.invalid) return;

    this.isLoading = true;
    this.errorMessage = '';

    this.authService.register(this.signUpForm.value).subscribe({
      next: (response) => {
        console.log('Backend says:', response);
        this.isLoading = false;

        const userId = response.user.id;
        this.router.navigate(['/bio'], {
          queryParams: { userId: userId },
        });
      },
      error: (err) => {
        alert('Registration failed: email already exists');
        console.error('Registration failed:', err);
        this.isLoading = false;
        this.errorMessage = err.error?.error || 'An unexpected error occurred.';
      },
    });
  }
}
