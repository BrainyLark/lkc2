import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModificationComponent } from './modification.component';

describe('ModificationComponent', () => {
  let component: ModificationComponent;
  let fixture: ComponentFixture<ModificationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModificationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
