import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { ScheduleDetailAdminComponent } from "./schedule-detail-admin.component";

describe("ScheduleDetailAdminComponent", () => {
  let component: ScheduleDetailAdminComponent;
  let fixture: ComponentFixture<ScheduleDetailAdminComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ScheduleDetailAdminComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ScheduleDetailAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
