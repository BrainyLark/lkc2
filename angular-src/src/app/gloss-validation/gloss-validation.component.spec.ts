import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GlossValidationComponent } from './gloss-validation.component';

describe('GlossValidationComponent', () => {
  let component: GlossValidationComponent;
  let fixture: ComponentFixture<GlossValidationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GlossValidationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GlossValidationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
