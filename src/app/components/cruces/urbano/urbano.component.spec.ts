import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UrbanoComponent } from './urbano.component';

describe('UrbanoComponent', () => {
  let component: UrbanoComponent;
  let fixture: ComponentFixture<UrbanoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UrbanoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UrbanoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
