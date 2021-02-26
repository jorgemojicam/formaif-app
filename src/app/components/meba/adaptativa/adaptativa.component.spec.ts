import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdaptativaComponent } from './adaptativa.component';

describe('AdaptativaComponent', () => {
  let component: AdaptativaComponent;
  let fixture: ComponentFixture<AdaptativaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdaptativaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdaptativaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
