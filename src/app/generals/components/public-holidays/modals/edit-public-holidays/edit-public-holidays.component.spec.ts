import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { EditPublicHolidaysComponent } from "./edit-public-holidays.component";

describe("EditPublicHolidaysComponent", () => {
  let component: EditPublicHolidaysComponent;
  let fixture: ComponentFixture<EditPublicHolidaysComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [EditPublicHolidaysComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditPublicHolidaysComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
