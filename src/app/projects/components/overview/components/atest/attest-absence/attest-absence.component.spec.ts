import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { AttestAbsenceComponent } from "./attest-absence.component";

describe("AtestAbsenceComponent", () => {
  let component: AttestAbsenceComponent;
  let fixture: ComponentFixture<AttestAbsenceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AttestAbsenceComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AttestAbsenceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
