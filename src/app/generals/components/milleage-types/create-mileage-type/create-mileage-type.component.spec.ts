import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { CreateMileageTypeComponent } from "./create-mileage-type.component";

describe("CreateMileageTypeComponent", () => {
  let component: CreateMileageTypeComponent;
  let fixture: ComponentFixture<CreateMileageTypeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CreateMileageTypeComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateMileageTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
