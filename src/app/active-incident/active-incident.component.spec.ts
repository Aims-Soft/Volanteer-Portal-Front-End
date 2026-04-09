import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActiveIncidentComponent } from './active-incident.component';

describe('ActiveIncidentComponent', () => {
  let component: ActiveIncidentComponent;
  let fixture: ComponentFixture<ActiveIncidentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ActiveIncidentComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ActiveIncidentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
