import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { WeekModalComponent } from "./week-modal.component";

describe("WeekModalComponent", () => {
  let component: WeekModalComponent;
  let fixture: ComponentFixture<WeekModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [WeekModalComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WeekModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
