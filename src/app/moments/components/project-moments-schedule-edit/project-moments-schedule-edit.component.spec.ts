import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { ProjectMomentsScheduleEditComponent } from "./project-moments-schedule-edit.component";

describe("ProjectMomentsScheduleEditComponent", () => {
  let component: ProjectMomentsScheduleEditComponent;
  let fixture: ComponentFixture<ProjectMomentsScheduleEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ProjectMomentsScheduleEditComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProjectMomentsScheduleEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
