import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { SendNotificationToUserForTimesheetComponent } from "./send-notification-to-user-for-timesheet.component";

describe("SendNotificationToUserForTimesheetComponent", () => {
  let component: SendNotificationToUserForTimesheetComponent;
  let fixture: ComponentFixture<SendNotificationToUserForTimesheetComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SendNotificationToUserForTimesheetComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(
      SendNotificationToUserForTimesheetComponent
    );
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
