import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GlossModificationComponent } from './gloss-modification.component';

describe('GlossModificationComponent', () => {
  let component: GlossModificationComponent;
  let fixture: ComponentFixture<GlossModificationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GlossModificationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GlossModificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
