import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { HasSeenModalComponent } from "./has-seen-modal.component";

describe("HasSeenModalComponent", () => {
  let component: HasSeenModalComponent;
  let fixture: ComponentFixture<HasSeenModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [HasSeenModalComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HasSeenModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
