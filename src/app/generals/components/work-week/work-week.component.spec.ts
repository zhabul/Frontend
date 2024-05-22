import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { WorkWeekComponent } from "./work-week.component";

describe("WorkWeekComponent", () => {
  let component: WorkWeekComponent;
  let fixture: ComponentFixture<WorkWeekComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [WorkWeekComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WorkWeekComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
