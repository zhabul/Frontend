import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { SyncfusionCalendarComponent } from "./syncfusion-calendar.component";

describe("SyncfusionCalendarComponent", () => {
  let component: SyncfusionCalendarComponent;
  let fixture: ComponentFixture<SyncfusionCalendarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SyncfusionCalendarComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SyncfusionCalendarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
