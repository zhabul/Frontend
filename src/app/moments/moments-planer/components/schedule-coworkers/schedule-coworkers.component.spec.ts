import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { ScheduleCoworkersComponent } from "./schedule-coworkers.component";

describe("ScheduleCoworkersComponent", () => {
  let component: ScheduleCoworkersComponent;
  let fixture: ComponentFixture<ScheduleCoworkersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ScheduleCoworkersComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ScheduleCoworkersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
