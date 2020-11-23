import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VentasHisComponent } from './ventas-his.component';

describe('VentasHisComponent', () => {
  let component: VentasHisComponent;
  let fixture: ComponentFixture<VentasHisComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VentasHisComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VentasHisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
