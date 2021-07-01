import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SolitudesComponent } from './solitudes.component';

describe('SolitudesComponent', () => {
  let component: SolitudesComponent;
  let fixture: ComponentFixture<SolitudesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SolitudesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SolitudesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
