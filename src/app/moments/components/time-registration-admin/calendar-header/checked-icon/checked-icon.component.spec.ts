import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { CheckedIconComponent } from "./checked-icon.component";

describe("CheckedIconComponent", () => {
  let component: CheckedIconComponent;
  let fixture: ComponentFixture<CheckedIconComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CheckedIconComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CheckedIconComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
