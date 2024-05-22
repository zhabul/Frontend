import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { NewPublicHolidaysComponent } from "./new-public-holidays.component";

describe("NewPublicHolidaysComponent", () => {
  let component: NewPublicHolidaysComponent;
  let fixture: ComponentFixture<NewPublicHolidaysComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [NewPublicHolidaysComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewPublicHolidaysComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
