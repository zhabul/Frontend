import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { MiniScheduleComponent } from "./mini-schedule.component";

describe("MiniScheduleComponent", () => {
  let component: MiniScheduleComponent;
  let fixture: ComponentFixture<MiniScheduleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [MiniScheduleComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MiniScheduleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
