import { Component, OnInit } from '@angular/core';
import { DBService } from '../../services/dashboard.service';

@Component({
  templateUrl: './db-dieta.html',
  styleUrls: ['./db-dieta.css'],
})
export class DashboardComponent implements OnInit {
  user: string = ''; // Variable to store the string
  dataName: string = '';
  dataProgress: string = '';

  constructor(private dbService: DBService) {}

  ngOnInit() {
    this.dbService.getUsername().subscribe({
      next: (data) => {
        this.user = data.user; // Assign the 'name' string to our variable
      },
      error: (err) => console.error('Could not load name', err)
    });
    this.dbService.getDataName().subscribe({
      next: (data) => {
        this.dataName = data.dataName;
      }
    })
    this.dbService.getDataProgress().subscribe({
      next: (data) => {
        this.dataProgress = data.dataProgress;
      },
    });
  }


}
