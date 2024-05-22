import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { TimeRegistrationUsersAbsenceComponent } from "./time-registration-users-absence.component";

describe("TimeRegistrationUsersAbsenceComponent", () => {
  let component: TimeRegistrationUsersAbsenceComponent;
  let fixture: ComponentFixture<TimeRegistrationUsersAbsenceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [TimeRegistrationUsersAbsenceComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TimeRegistrationUsersAbsenceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
