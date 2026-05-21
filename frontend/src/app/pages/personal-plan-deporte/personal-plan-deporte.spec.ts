import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PersonalPlanDeporte } from './personal-plan-deporte';

describe('PersonalPlanDeporte', () => {
  let component: PersonalPlanDeporte;
  let fixture: ComponentFixture<PersonalPlanDeporte>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PersonalPlanDeporte],
    }).compileComponents();

    fixture = TestBed.createComponent(PersonalPlanDeporte);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
