import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CrucesComponent } from './cruces.component';

describe('CrucesComponent', () => {
  let component: CrucesComponent;
  let fixture: ComponentFixture<CrucesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CrucesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CrucesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
