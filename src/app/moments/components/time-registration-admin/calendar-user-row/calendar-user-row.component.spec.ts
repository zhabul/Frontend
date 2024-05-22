import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { CalendarUserRowComponent } from "./calendar-user-row.component";

describe("CalendarUserRowComponent", () => {
  let component: CalendarUserRowComponent;
  let fixture: ComponentFixture<CalendarUserRowComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CalendarUserRowComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CalendarUserRowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
