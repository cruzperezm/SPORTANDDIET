import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-bio',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './bio.html',
  styleUrl: './bio.css',
})
export class bio {
  google_logo = 'images/google-logo.png';
  fb_logo = 'images/facebook-logo.png';
  icloud_logo = 'images/icloud-logo.png';
  email: string =``;
  saveData(){
    sessionStorage.setItem('name', this.email.valueOf());
    sessionStorage.setItem('location', 'Pakistan');
  }
}
