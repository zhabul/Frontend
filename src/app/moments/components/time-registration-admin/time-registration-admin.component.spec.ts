import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { TimeRegistrationAdminComponent } from "./time-registration-admin.component";

describe("TimeRegistrationAdminComponent", () => {
  let component: TimeRegistrationAdminComponent;
  let fixture: ComponentFixture<TimeRegistrationAdminComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [TimeRegistrationAdminComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TimeRegistrationAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
