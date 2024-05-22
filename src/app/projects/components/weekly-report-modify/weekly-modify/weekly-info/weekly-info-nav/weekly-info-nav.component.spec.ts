import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WeeklyInfoNavComponent } from './weekly-info-nav.component';

describe('WeeklyInfoNavComponent', () => {
  let component: WeeklyInfoNavComponent;
  let fixture: ComponentFixture<WeeklyInfoNavComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WeeklyInfoNavComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WeeklyInfoNavComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
