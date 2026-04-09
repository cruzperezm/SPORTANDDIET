import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

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
  goal: string = '';
  act: string = '';
  cKg: number | undefined;
  dKg: number | undefined;
  nWeeks: number | undefined;

  constructor(private router: Router) {}

  changeBio() {
    this.bioData += 1;
  }

  saveData() {
    sessionStorage.setItem('genre', this.genre.valueOf());
    // @ts-ignore
    sessionStorage.setItem('age', this.age.valueOf());
    // @ts-ignore
    sessionStorage.setItem('height', this.height.valueOf());
    sessionStorage.setItem('goal', this.goal.valueOf());
    sessionStorage.setItem('act', this.act.valueOf());
    // @ts-ignore
    sessionStorage.setItem('cKg', this.cKg.valueOf());
    // @ts-ignore
    sessionStorage.setItem('dKg', this.dKg.valueOf());
    // @ts-ignore
    sessionStorage.setItem('nWeeks', this.nWeeks.valueOf());
    this.router.navigate(['/login']);
  }

  onChange(e: any) {
    if (e.target.name === 'radio') {
      this.goal = e.target.value;
    }

    if (e.target.name === 'radio1') {
      this.act = e.target.value;
    }
  }
}
