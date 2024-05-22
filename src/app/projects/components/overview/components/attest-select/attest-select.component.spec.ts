import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { AttestSelectComponent } from "./attest-select.component";

describe("AttestSelectComponent", () => {
  let component: AttestSelectComponent;
  let fixture: ComponentFixture<AttestSelectComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AttestSelectComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AttestSelectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
