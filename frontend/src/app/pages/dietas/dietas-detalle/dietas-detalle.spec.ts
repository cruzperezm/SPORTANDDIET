import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DietasDetalleComponent } from './dietas-detalle';

describe('DietasDetalle', () => {
  let component: DietasDetalleComponent;
  let fixture: ComponentFixture<DietasDetalleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DietasDetalleComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(DietasDetalleComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
