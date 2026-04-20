import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeportesDetalle } from './deportes-detalle';

describe('DeportesDetalle', () => {
  let component: DeportesDetalle;
  let fixture: ComponentFixture<DeportesDetalle>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DeportesDetalle],
    }).compileComponents();

    fixture = TestBed.createComponent(DeportesDetalle);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
