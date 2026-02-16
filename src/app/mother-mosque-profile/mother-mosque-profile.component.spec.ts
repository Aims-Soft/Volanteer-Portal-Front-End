import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MotherMosqueProfileComponent } from './mother-mosque-profile.component';

describe('MotherMosqueProfileComponent', () => {
  let component: MotherMosqueProfileComponent;
  let fixture: ComponentFixture<MotherMosqueProfileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MotherMosqueProfileComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MotherMosqueProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
