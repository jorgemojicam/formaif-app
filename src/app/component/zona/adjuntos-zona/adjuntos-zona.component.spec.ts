import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdjuntosZonaComponent } from './adjuntos-zona.component';

describe('AdjuntosZonaComponent', () => {
  let component: AdjuntosZonaComponent;
  let fixture: ComponentFixture<AdjuntosZonaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdjuntosZonaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdjuntosZonaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
