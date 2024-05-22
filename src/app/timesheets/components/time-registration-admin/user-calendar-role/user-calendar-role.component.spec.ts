import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { UserCalendarRoleComponent } from "./user-calendar-role.component";

describe("UserCalendarRoleComponent", () => {
  let component: UserCalendarRoleComponent;
  let fixture: ComponentFixture<UserCalendarRoleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [UserCalendarRoleComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserCalendarRoleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
