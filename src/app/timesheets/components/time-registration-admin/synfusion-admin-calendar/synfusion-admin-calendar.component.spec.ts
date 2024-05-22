import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { SynfusionAdminCalendarComponent } from "./synfusion-admin-calendar.component";

describe("SynfusionAdminCalendarComponent", () => {
  let component: SynfusionAdminCalendarComponent;
  let fixture: ComponentFixture<SynfusionAdminCalendarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SynfusionAdminCalendarComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SynfusionAdminCalendarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
