import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DaughterMosqueDashboardComponent } from './daughter-mosque-dashboard.component';

describe('DaughterMosqueDashboardComponent', () => {
  let component: DaughterMosqueDashboardComponent;
  let fixture: ComponentFixture<DaughterMosqueDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DaughterMosqueDashboardComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DaughterMosqueDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
