import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ActivosNegocioComponent } from './activos-negocio.component';

describe('ActivosNegocioComponent', () => {
  let component: ActivosNegocioComponent;
  let fixture: ComponentFixture<ActivosNegocioComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ActivosNegocioComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ActivosNegocioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
