import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DistributionDetailsComponent } from './distribution-details.component';

describe('DistributionDetailsComponent', () => {
  let component: DistributionDetailsComponent;
  let fixture: ComponentFixture<DistributionDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DistributionDetailsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DistributionDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
