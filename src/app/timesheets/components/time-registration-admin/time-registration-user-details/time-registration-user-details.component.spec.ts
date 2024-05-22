import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { TimeRegistrationUserDetailsComponent } from "./time-registration-user-details.component";

describe("TimeRegistrationUserDetailsComponent", () => {
  let component: TimeRegistrationUserDetailsComponent;
  let fixture: ComponentFixture<TimeRegistrationUserDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [TimeRegistrationUserDetailsComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TimeRegistrationUserDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
