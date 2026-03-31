import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecentIncidentComponent } from './recent-incident.component';

describe('RecentIncidentComponent', () => {
  let component: RecentIncidentComponent;
  let fixture: ComponentFixture<RecentIncidentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RecentIncidentComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RecentIncidentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
