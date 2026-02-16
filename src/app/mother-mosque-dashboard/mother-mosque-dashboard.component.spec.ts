import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MotherMosqueDashboardComponent } from './mother-mosque-dashboard.component';

describe('MotherMosqueDashboardComponent', () => {
  let component: MotherMosqueDashboardComponent;
  let fixture: ComponentFixture<MotherMosqueDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MotherMosqueDashboardComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MotherMosqueDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
