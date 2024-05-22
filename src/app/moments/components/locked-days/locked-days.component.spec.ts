import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { LockedDaysComponent } from "./locked-days.component";

describe("LockedDaysComponent", () => {
  let component: LockedDaysComponent;
  let fixture: ComponentFixture<LockedDaysComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [LockedDaysComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LockedDaysComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
