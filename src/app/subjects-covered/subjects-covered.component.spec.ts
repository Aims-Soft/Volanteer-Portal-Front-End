import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubjectsCoveredComponent } from './subjects-covered.component';

describe('SubjectsCoveredComponent', () => {
  let component: SubjectsCoveredComponent;
  let fixture: ComponentFixture<SubjectsCoveredComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SubjectsCoveredComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SubjectsCoveredComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
