import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AnalisisagroComponent } from './analisisagro.component';

describe('AnalisisagroComponent', () => {
  let component: AnalisisagroComponent;
  let fixture: ComponentFixture<AnalisisagroComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AnalisisagroComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AnalisisagroComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
