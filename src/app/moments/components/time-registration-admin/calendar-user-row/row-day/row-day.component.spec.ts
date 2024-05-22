import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { RowDayComponent } from "./row-day.component";

describe("RowDayComponent", () => {
  let component: RowDayComponent;
  let fixture: ComponentFixture<RowDayComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [RowDayComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RowDayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
