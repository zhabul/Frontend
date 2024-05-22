import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { NewSchedulePlanComponent } from "./new-schedule-plan.component";

describe("NewSchedulePlanComponent", () => {
  let component: NewSchedulePlanComponent;
  let fixture: ComponentFixture<NewSchedulePlanComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [NewSchedulePlanComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewSchedulePlanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
