import { Component, inject } from "@angular/core";
import { RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { AuthService } from "../../services/auth.service";

@Component({
    selector: 'app-login',
    standalone: true,
    imports: [RouterLink, ReactiveFormsModule],
    templateUrl: './login.html',
    styleUrl: './login.css',
})
export class Login {
    google_logo = "/shared/images/google-logo.png";
    fb_logo = "/shared/images/facebook-logo.png";
    icloud_logo = "/shared/images/icloud-logo.png";

    private fb = inject(FormBuilder);
    private authService = inject(AuthService);

    loginForm: FormGroup = this.fb.group({
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required]]
    });

    isLoading = false;
    errorMessage = '';

    login() {
        if(this.loginForm.invalid) return;

        this.isLoading = true;
        this.errorMessage = '';

        this.authService.login(this.loginForm.value).subscribe({
            next: (response) => {
                console.log("Logged in!");
                this.isLoading = false;
            },

            error: (err) => {
                this.isLoading = false;
                if (err.status === 401) {
                    this.errorMessage = 'Incorrect email or password.'; 
                } else {
                    this.errorMessage = "Server error. Please try again later."
                }
            }
        })
    }

}