import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { ScheduleDetailCalendarComponent } from "./schedule-detail-calendar.component";

describe("ScheduleDetailCalendarComponent", () => {
  let component: ScheduleDetailCalendarComponent;
  let fixture: ComponentFixture<ScheduleDetailCalendarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ScheduleDetailCalendarComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ScheduleDetailCalendarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
