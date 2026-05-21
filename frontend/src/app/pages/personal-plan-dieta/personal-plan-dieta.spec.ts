import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PersonalPlanDieta } from './personal-plan-dieta';

describe('PersonalPlanDieta', () => {
  let component: PersonalPlanDieta;
  let fixture: ComponentFixture<PersonalPlanDieta>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PersonalPlanDieta],
    }).compileComponents();

    fixture = TestBed.createComponent(PersonalPlanDieta);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
