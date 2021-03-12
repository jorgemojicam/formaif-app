import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ResultadoMebaComponent } from './resultado-meba.component';

describe('ResultadoMebaComponent', () => {
  let component: ResultadoMebaComponent;
  let fixture: ComponentFixture<ResultadoMebaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ResultadoMebaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ResultadoMebaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
