import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OtrosIngresosFamComponent } from './otros-ingresos-fam.component';

describe('OtrosIngresosFamComponent', () => {
  let component: OtrosIngresosFamComponent;
  let fixture: ComponentFixture<OtrosIngresosFamComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OtrosIngresosFamComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OtrosIngresosFamComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
