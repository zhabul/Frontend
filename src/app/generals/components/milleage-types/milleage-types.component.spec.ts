import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { MilleageTypesComponent } from "./milleage-types.component";

describe("MilleageTypesComponent", () => {
  let component: MilleageTypesComponent;
  let fixture: ComponentFixture<MilleageTypesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [MilleageTypesComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MilleageTypesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
