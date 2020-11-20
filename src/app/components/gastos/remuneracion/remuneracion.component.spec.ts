import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RemuneracionComponent } from './remuneracion.component';

describe('RemuneracionComponent', () => {
  let component: RemuneracionComponent;
  let fixture: ComponentFixture<RemuneracionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RemuneracionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RemuneracionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
