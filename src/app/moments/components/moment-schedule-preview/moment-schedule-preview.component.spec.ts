import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { MomentSchedulePreviewComponent } from "./moment-schedule-preview.component";

describe("MomentSchedulePreviewComponent", () => {
  let component: MomentSchedulePreviewComponent;
  let fixture: ComponentFixture<MomentSchedulePreviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [MomentSchedulePreviewComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MomentSchedulePreviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
