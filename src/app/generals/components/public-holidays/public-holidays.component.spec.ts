import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { PublicHolidaysComponent } from "./public-holidays.component";

describe("PublicHolidaysComponent", () => {
  let component: PublicHolidaysComponent;
  let fixture: ComponentFixture<PublicHolidaysComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [PublicHolidaysComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PublicHolidaysComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
