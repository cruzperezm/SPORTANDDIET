import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { MatTabsModule } from '@angular/material/tabs';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { ProfileService } from '../../../services/profile.service';
import { ChangeDetectorRef } from '@angular/core';

export function emailMatchValidator(group: AbstractControl): ValidationErrors | null {
  const email = group.get('email')?.value;
  const confirmEmail = group.get('confirmEmail')?.value;
  return email === confirmEmail ? null : { emailMismatch: true };
}

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
    MatSelectModule,
  ],
  templateUrl: './profile-view.html',
  styleUrls: ['./profile-view.css'],
})
export class ProfileViewComponent implements OnInit {
  public user = {
    username: '',
    email: '',
    photoUrl: '',
  };

  public accountForm!: FormGroup;
  public biometricsForm!: FormGroup;
  public preferencesForm!: FormGroup;
  public photoPreview: string | ArrayBuffer | null = null;
  public selectedImageFile: File | null = null;

  constructor(private fb: FormBuilder, private profileService: ProfileService, private cdr: ChangeDetectorRef) {
    this.initForms();
  }


  ngOnInit(): void {
    this.loadUserProfile();
  }

  loadUserProfile() {
    this.profileService.getProfile().subscribe({
      next: (data: any) => {
        this.user.username = data.username;
        this.user.email = data.email;
        this.user.photoUrl = data.photoUrl;

        this.accountForm.patchValue({
          username: data.username,
          email: data.email,
          confirmEmail: data.email,
          pronouns: data.pronouns
        });

        this.preferencesForm.patchValue({
          activityLevel: data.biometrics?.activity || 'MODERATE',
          allergens: data.allergies || []
        });

        if (data.biometrics) {
          this.biometricsForm.patchValue({
            age: data.biometrics.age,
            height: data.biometrics.height,
            weight: data.biometrics.c_weight,
            targetWeight: data.biometrics.d_weight,
            trackingWeeks: data.biometrics.weeks
          });
        }
      },
      error: (err) => {
        console.error("Error al cargar datos iniciales", err);
      }
    });
  }

  onFileSelected(event: any) {
    const file: File = event.target.files[0];

    if (file) {
      this.selectedImageFile = file;

      const reader = new FileReader();
      reader.onload = (e) => {
        this.photoPreview = e.target?.result as string;
        this.cdr.detectChanges();
      };
      reader.readAsDataURL(file);
    }
  }

  saveProfile() {
    if (this.accountForm.invalid || this.biometricsForm.invalid || this.preferencesForm.invalid) {
      alert('Por favor, corrige los errores del formulario antes de guardar.');
      this.accountForm.markAllAsTouched();
      this.biometricsForm.markAllAsTouched();
      this.preferencesForm.markAllAsTouched();
      return;
    }

    const profileData = {
      ...this.accountForm.value,
      ...this.biometricsForm.value,
      ...this.preferencesForm.value,
      photoUrl: this.photoPreview || this.user.photoUrl
    };

    delete profileData.confirmEmail;

    this.profileService.updateProfile(profileData).subscribe({
      next: (response) => {
        console.log('¡Perfil actualizado con éxito!', response);
        alert('Cambios guardados correctamente');
      },
      error: (err) => {
        console.error('Error al guardar el perfil:', err);
        alert('Hubo un error al guardar los cambios');
      }
    });
  }

  private initForms() {
    this.accountForm = this.fb.group(
      {
        username: ['', Validators.required],
        email: ['', [Validators.required, Validators.email]],
        confirmEmail: ['', Validators.required],
        pronouns: [''],
      },
      { validators: emailMatchValidator },
    );

    this.biometricsForm = this.fb.group({
      age: [null, [Validators.required, Validators.min(14), Validators.max(99)]],
      height: [null, [Validators.required, Validators.min(100), Validators.max(250)]],
      weight: [null, [Validators.required, Validators.min(30), Validators.max(300)]],
      targetWeight: [null, [Validators.required, Validators.min(30), Validators.max(300)]],
      trackingWeeks: [null, [Validators.required, Validators.min(1), Validators.max(52)]]
    });

    this.preferencesForm = this.fb.group({
      activityLevel: ['MODERATE', Validators.required],
      allergens: [[]],
    });
  }

  isDirty(): boolean {
    return this.accountForm?.dirty || this.biometricsForm?.dirty || this.preferencesForm?.dirty;
  }

  get emailCtrl() {
    return this.accountForm.get('email');
  }
  get confirmEmailCtrl() {
    return this.accountForm.get('confirmEmail');
  }
  get form() {
    return this.accountForm;
  }

  get ageCtrl() {
    return this.biometricsForm.get('age');
  }
  get heightCtrl() {
    return this.biometricsForm.get('height');
  }
  get weightCtrl() {
    return this.biometricsForm.get('weight');
  }
  get targetWeightCtrl() {
    return this.biometricsForm.get('targetWeight');
  }
  get trackingWeeksCtrl() {
    return this.biometricsForm.get('trackingWeeks');
  }
}
