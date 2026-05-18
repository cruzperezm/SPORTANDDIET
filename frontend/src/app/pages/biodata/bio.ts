import { Component, inject } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-bio',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule],
  templateUrl: './bio.html',
  styleUrl: './bio.css',
})
export class Bio {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  protected bioData: number = 0;
  private queryId: number | null | undefined;

  public genders: string[] = ['Hombre', 'Mujer', 'No binario', 'Prefiero no decir'];

  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    this.queryId = parseInt(<string>this.route.snapshot.queryParamMap.get('userId'));
    console.log('id:', this.queryId);
  }

  bioForm: FormGroup = this.fb.group({
    gender: ['', [Validators.required]],
    age: ['', [Validators.required, Validators.min(14), Validators.max(120)]],
    height: ['', [Validators.required, Validators.min(120), Validators.max(220)]],
    goal: ['', [Validators.required]],
    act: ['', [Validators.required]],
    cKg: ['', [Validators.required]],
    dKg: ['', [Validators.required]],
    nWeeks: ['', [Validators.required, Validators.min(1)]],
    id: [''],
  });

  next() {
    this.bioData += 1;
  }
  back() {
    this.bioData -= 1;
  }

  isLoading = false;
  errorMessage = '';

  saveData() {
    this.bioForm.patchValue({ id: this.queryId });
    if (this.bioForm.invalid) return;

    this.isLoading = true;
    this.errorMessage = '';

    this.authService.bio(this.bioForm.value).subscribe({
      next: (response) => {
        console.log('Backend says:', response);
        this.isLoading = false;
        this.router.navigate(['/']);
      },
      error: (err) => {
        alert('Form failed to upload');
        console.error('Registration failed:', err);
        this.isLoading = false;
        this.errorMessage = err.error?.error || 'An unexpected error occurred.';
      },
    });
  }

  get gender() {
    return this.bioForm.get('gender');
  }

  get height() {
    return this.bioForm.get('height');
  }

  get age() {
    return this.bioForm.get('age');
  }

  get goal() {
    return this.bioForm.get('goal');
  }

  get act() {
    return this.bioForm.get('act');
  }

  get cKg() {
    return this.bioForm.get('cKg');
  }

  get dKg() {
    return this.bioForm.get('dKg');
  }

  get nWeeks() {
    return this.bioForm.get('nWeeks');
  }
}
