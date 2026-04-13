import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './signup.html',
  styleUrl: './signup.css',
})
export class Signup {
  google_logo = 'shared/images/google-logo.png';
  fb_logo = 'shared/images/facebook-logo.png';
  icloud_logo = 'shared/images/icloud-logo.png';

  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  signUpForm: FormGroup = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    username: ['', [Validators.required]],
    password: ['', [Validators.required]],
  });

  isLoading = false;
  errorMessage = '';

  signup() {
    if (this.signUpForm.invalid) return;

    this.isLoading = true;
    this.errorMessage = '';

    this.authService.register(this.signUpForm.value).subscribe({
      next: (response) => {
        console.log('Backend says:', response);
        this.isLoading = false;
        this.router.navigate(['/bio']);
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
