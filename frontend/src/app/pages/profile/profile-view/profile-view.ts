import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatTabsModule } from '@angular/material/tabs';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-profile-view',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatTabsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatSelectModule
  ],
  templateUrl: './profile-view.html',
  styleUrls: ['./profile-view.css']
})
export class ProfileComponent implements OnInit {

  public user = {
    username: '',
    email: '',
    photoUrl: ''
  };

  public accountForm!: FormGroup;
  public biometricsForm!: FormGroup;

  constructor(private fb: FormBuilder) {
    this.initForms();
  }

  ngOnInit(): void {
  }

  private initForms() {
    this.accountForm = this.fb.group({
      username: ['', Validators.required],
      email: [{ value: '', disabled: true }]
    });

    this.biometricsForm = this.fb.group({
      weight: [null],
      height: [null],
      gender: ['OTHER']
    });
  }

  saveChanges() {
    console.log(this.accountForm.value);
  }

  isDirty(): boolean {
    return this.accountForm?.dirty || this.biometricsForm?.dirty;
  }
}
