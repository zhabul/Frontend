import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { ProjectMomentsScheduleComponent } from "./project-moments-schedule.component";

describe("ProjectMomentsScheduleComponent", () => {
  let component: ProjectMomentsScheduleComponent;
  let fixture: ComponentFixture<ProjectMomentsScheduleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ProjectMomentsScheduleComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProjectMomentsScheduleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
