import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { AtaPrognosisComponent } from "./ata-prognosis.component";

describe("AtaPrognosisComponent", () => {
  let component: AtaPrognosisComponent;
  let fixture: ComponentFixture<AtaPrognosisComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AtaPrognosisComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AtaPrognosisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
