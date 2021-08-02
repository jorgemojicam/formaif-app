import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TipoFormComponent } from './tipo-form.component';

describe('TipoFormComponent', () => {
  let component: TipoFormComponent;
  let fixture: ComponentFixture<TipoFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TipoFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TipoFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
