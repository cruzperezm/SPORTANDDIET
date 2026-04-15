import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeportesPlan } from './deportes-plan';

describe('DeportesPlan', () => {
  let component: DeportesPlan;
  let fixture: ComponentFixture<DeportesPlan>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DeportesPlan],
    }).compileComponents();

    fixture = TestBed.createComponent(DeportesPlan);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
