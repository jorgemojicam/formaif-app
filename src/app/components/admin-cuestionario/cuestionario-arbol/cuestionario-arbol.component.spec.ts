import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CuestionarioArbolComponent } from './cuestionario-arbol.component';

describe('CuestionarioArbolComponent', () => {
  let component: CuestionarioArbolComponent;
  let fixture: ComponentFixture<CuestionarioArbolComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CuestionarioArbolComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CuestionarioArbolComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
