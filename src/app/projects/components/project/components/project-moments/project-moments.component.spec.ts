import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { ProjectMomentsComponent } from "./project-moments.component";

describe("ProjectMomentsComponent", () => {
  let component: ProjectMomentsComponent;
  let fixture: ComponentFixture<ProjectMomentsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ProjectMomentsComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProjectMomentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
