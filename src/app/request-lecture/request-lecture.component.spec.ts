import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RequestLectureComponent } from './request-lecture.component';

describe('RequestLectureComponent', () => {
  let component: RequestLectureComponent;
  let fixture: ComponentFixture<RequestLectureComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RequestLectureComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RequestLectureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
