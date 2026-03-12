import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecomendedBooksComponent } from './recomended-books.component';

describe('RecomendedBooksComponent', () => {
  let component: RecomendedBooksComponent;
  let fixture: ComponentFixture<RecomendedBooksComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RecomendedBooksComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RecomendedBooksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
