import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { DotsPopupComponent } from "./dots-popup.component";

describe("DotsPopupComponent", () => {
  let component: DotsPopupComponent;
  let fixture: ComponentFixture<DotsPopupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [DotsPopupComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DotsPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
