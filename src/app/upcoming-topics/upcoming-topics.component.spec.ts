import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpcomingTopicsComponent } from './upcoming-topics.component';

describe('UpcomingTopicsComponent', () => {
  let component: UpcomingTopicsComponent;
  let fixture: ComponentFixture<UpcomingTopicsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UpcomingTopicsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UpcomingTopicsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
