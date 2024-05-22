import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { ProjectScheduleNewComponent } from "./project-schedule-new.component";

describe("ProjectScheduleNewComponent", () => {
  let component: ProjectScheduleNewComponent;
  let fixture: ComponentFixture<ProjectScheduleNewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ProjectScheduleNewComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProjectScheduleNewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
