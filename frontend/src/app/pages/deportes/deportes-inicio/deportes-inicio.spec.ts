import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeportesInicio } from './deportes-inicio';

describe('DeportesInicio', () => {
  let component: DeportesInicio;
  let fixture: ComponentFixture<DeportesInicio>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DeportesInicio],
    }).compileComponents();

    fixture = TestBed.createComponent(DeportesInicio);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
