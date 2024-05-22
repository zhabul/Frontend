import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { ProjectSchedulePlanerComponent } from "./project-schedule-planer.component";

describe("ProjectSchedulePlanerComponent", () => {
  let component: ProjectSchedulePlanerComponent;
  let fixture: ComponentFixture<ProjectSchedulePlanerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ProjectSchedulePlanerComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProjectSchedulePlanerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
