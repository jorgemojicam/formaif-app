import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GastosFamiliaComponent } from './gastos-familia.component';

describe('GastosFamiliaComponent', () => {
  let component: GastosFamiliaComponent;
  let fixture: ComponentFixture<GastosFamiliaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GastosFamiliaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GastosFamiliaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
