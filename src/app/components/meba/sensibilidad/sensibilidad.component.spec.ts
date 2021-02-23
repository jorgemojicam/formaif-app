import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SensibilidadComponent } from './sensibilidad.component';

describe('SensibilidadComponent', () => {
  let component: SensibilidadComponent;
  let fixture: ComponentFixture<SensibilidadComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SensibilidadComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SensibilidadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
