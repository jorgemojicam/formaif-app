import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MebaComponent } from './meba.component';

describe('MebaComponent', () => {
  let component: MebaComponent;
  let fixture: ComponentFixture<MebaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MebaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MebaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
