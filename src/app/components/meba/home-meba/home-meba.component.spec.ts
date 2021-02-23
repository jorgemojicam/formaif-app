import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeMebaComponent } from './home-meba.component';

describe('HomeMebaComponent', () => {
  let component: HomeMebaComponent;
  let fixture: ComponentFixture<HomeMebaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HomeMebaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HomeMebaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
