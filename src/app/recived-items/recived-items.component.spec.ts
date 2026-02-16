import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecivedItemsComponent } from './recived-items.component';

describe('RecivedItemsComponent', () => {
  let component: RecivedItemsComponent;
  let fixture: ComponentFixture<RecivedItemsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RecivedItemsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RecivedItemsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
