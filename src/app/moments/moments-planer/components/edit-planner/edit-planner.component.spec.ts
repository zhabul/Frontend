import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { EditPlannerComponent } from "./edit-planner.component";

describe("EditPlannerComponent", () => {
  let component: EditPlannerComponent;
  let fixture: ComponentFixture<EditPlannerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [EditPlannerComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditPlannerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
