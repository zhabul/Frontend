import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { LockIconsComponent } from "./lock-icons.component";

describe("LockIconsComponent", () => {
  let component: LockIconsComponent;
  let fixture: ComponentFixture<LockIconsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [LockIconsComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LockIconsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
