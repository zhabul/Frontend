import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { PermitChildrenComponent } from "./permit-children.component";

describe("PermitChildrenComponent", () => {
  let component: PermitChildrenComponent;
  let fixture: ComponentFixture<PermitChildrenComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [PermitChildrenComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PermitChildrenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
