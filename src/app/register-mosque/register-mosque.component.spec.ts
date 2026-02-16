import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegisterMosqueComponent } from './register-mosque.component';

describe('RegisterMosqueComponent', () => {
  let component: RegisterMosqueComponent;
  let fixture: ComponentFixture<RegisterMosqueComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RegisterMosqueComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RegisterMosqueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
