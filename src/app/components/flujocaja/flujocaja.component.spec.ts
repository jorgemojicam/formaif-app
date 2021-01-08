import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FlujocajaComponent } from './flujocaja.component';

describe('FlujocajaComponent', () => {
  let component: FlujocajaComponent;
  let fixture: ComponentFixture<FlujocajaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FlujocajaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FlujocajaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
