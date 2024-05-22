import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { NewAbsenceTypeComponent } from "./new-absence-type.component";

describe("NewAbsenceTypeComponent", () => {
  let component: NewAbsenceTypeComponent;
  let fixture: ComponentFixture<NewAbsenceTypeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [NewAbsenceTypeComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewAbsenceTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
