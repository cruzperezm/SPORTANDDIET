import { Component } from "@angular/core";

@Component({
  selector: 'app-login', // (o 'app-signup')
  standalone: true,
  imports: [],
  templateUrl: './login.html', // (o './signup.html')
  styleUrl: './login.css',     // (o './signup.css')
})
export class Login { // (o class Signup)
  google_logo = "/shared/images/google-logo.png";
  fb_logo = "/shared/images/facebook-logo.png";
  icloud_logo = "/shared/images/icloud-logo.png";

  // AÑADE ESTA FUNCIÓN:
  loginConGoogle() {
    // Redirige a la ruta exacta que configuramos en Express
    window.location.href = 'http://localhost:3000/api/auth/google';
  }
}
