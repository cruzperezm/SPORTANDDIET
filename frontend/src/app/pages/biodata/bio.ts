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
  age: number | undefined;
  height: number | undefined;
  genre: string = ``;
  protected bioData: number = 0;

  changeBio() {
    this.bioData += 1;
  }

  saveData() {
    sessionStorage.setItem('genre', this.genre.valueOf());
    // @ts-ignore
    sessionStorage.setItem('age', this.age.valueOf());
    // @ts-ignore
    sessionStorage.setItem('height', this.height.valueOf());
  }
}
