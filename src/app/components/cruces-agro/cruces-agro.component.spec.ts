import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CrucesAgroComponent } from './cruces-agro.component';

describe('CrucesAgroComponent', () => {
  let component: CrucesAgroComponent;
  let fixture: ComponentFixture<CrucesAgroComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CrucesAgroComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CrucesAgroComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
