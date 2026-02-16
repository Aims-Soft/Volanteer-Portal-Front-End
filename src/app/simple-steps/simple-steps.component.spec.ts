import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SimpleStepsComponent } from './simple-steps.component';

describe('SimpleStepsComponent', () => {
  let component: SimpleStepsComponent;
  let fixture: ComponentFixture<SimpleStepsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SimpleStepsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SimpleStepsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
