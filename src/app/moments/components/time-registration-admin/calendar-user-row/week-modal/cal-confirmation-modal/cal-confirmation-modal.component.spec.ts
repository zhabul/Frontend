import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { CalConfirmationModalComponent } from "./cal-confirmation-modal.component";

describe("CalConfirmationModalComponent", () => {
  let component: CalConfirmationModalComponent;
  let fixture: ComponentFixture<CalConfirmationModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CalConfirmationModalComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CalConfirmationModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
