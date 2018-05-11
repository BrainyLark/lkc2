import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GlossTranslationComponent } from './gloss-translation.component';

describe('GlossTranslationComponent', () => {
  let component: GlossTranslationComponent;
  let fixture: ComponentFixture<GlossTranslationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GlossTranslationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GlossTranslationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
