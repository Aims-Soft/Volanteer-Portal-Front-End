import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MosqueRegisterationComponent } from './mosque-registeration.component';

describe('MosqueRegisterationComponent', () => {
  let component: MosqueRegisterationComponent;
  let fixture: ComponentFixture<MosqueRegisterationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MosqueRegisterationComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MosqueRegisterationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
