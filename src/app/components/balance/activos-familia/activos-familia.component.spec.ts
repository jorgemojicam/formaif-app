import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ActivosFamiliaComponent } from './activos-familia.component';

describe('ActivosFamiliaComponent', () => {
  let component: ActivosFamiliaComponent;
  let fixture: ComponentFixture<ActivosFamiliaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ActivosFamiliaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ActivosFamiliaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
