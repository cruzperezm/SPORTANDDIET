import { Component } from "@angular/core";

@Component({
    selector: 'app-login',
    standalone: true,
    imports: [],
    templateUrl: './login.html',
    styleUrl: './login.css',
})
export class Login {
    google_logo = "/shared/images/google-logo.png";
    fb_logo = "/shared/images/facebook-logo.png";
    icloud_logo = "/shared/images/icloud-logo.png";
}