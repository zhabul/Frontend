import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { UserProjectSchedulePlannerComponent } from "./user-project-schedule-planner.component";

describe("UserProjectSchedulePlannerComponent", () => {
  let component: UserProjectSchedulePlannerComponent;
  let fixture: ComponentFixture<UserProjectSchedulePlannerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [UserProjectSchedulePlannerComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserProjectSchedulePlannerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
