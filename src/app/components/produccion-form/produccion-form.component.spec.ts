import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProduccionFormComponent } from './produccion-form.component';

describe('ProduccionFormComponent', () => {
  let component: ProduccionFormComponent;
  let fixture: ComponentFixture<ProduccionFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProduccionFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProduccionFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
