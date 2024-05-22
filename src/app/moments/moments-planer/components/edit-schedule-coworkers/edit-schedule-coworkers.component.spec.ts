import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { EditScheduleCoworkersComponent } from "./edit-schedule-coworkers.component";

describe("EditScheduleCoworkersComponent", () => {
  let component: EditScheduleCoworkersComponent;
  let fixture: ComponentFixture<EditScheduleCoworkersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [EditScheduleCoworkersComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditScheduleCoworkersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
