import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { EditMileageTypeComponent } from "./edit-mileage-type.component";

describe("EditMileageTypeComponent", () => {
  let component: EditMileageTypeComponent;
  let fixture: ComponentFixture<EditMileageTypeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [EditMileageTypeComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditMileageTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
