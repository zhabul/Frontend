import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScheduleCalendarNavigationComponent } from './schedule-calendar-navigation.component';

describe('ScheduleCalendarNavigationComponent', () => {
  let component: ScheduleCalendarNavigationComponent;
  let fixture: ComponentFixture<ScheduleCalendarNavigationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ScheduleCalendarNavigationComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ScheduleCalendarNavigationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
