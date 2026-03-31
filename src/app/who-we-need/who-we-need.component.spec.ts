import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WhoWeNeedComponent } from './who-we-need.component';

describe('WhoWeNeedComponent', () => {
  let component: WhoWeNeedComponent;
  let fixture: ComponentFixture<WhoWeNeedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WhoWeNeedComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WhoWeNeedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
