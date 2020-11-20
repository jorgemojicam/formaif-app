import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GastosNegocioComponent } from './gastos-negocio.component';

describe('GastosNegocioComponent', () => {
  let component: GastosNegocioComponent;
  let fixture: ComponentFixture<GastosNegocioComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GastosNegocioComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GastosNegocioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
