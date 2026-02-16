import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DaughterMosqueProfileComponent } from './daughter-mosque-profile.component';

describe('DaughterMosqueProfileComponent', () => {
  let component: DaughterMosqueProfileComponent;
  let fixture: ComponentFixture<DaughterMosqueProfileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DaughterMosqueProfileComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DaughterMosqueProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
