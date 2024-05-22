import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { StickyWeeksComponent } from "./sticky-weeks.component";

describe("StickyWeeksComponent", () => {
  let component: StickyWeeksComponent;
  let fixture: ComponentFixture<StickyWeeksComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [StickyWeeksComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StickyWeeksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
