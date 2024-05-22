import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { AtaPrognosisShowTableComponent } from "./ata-prognosis-show-table.component";

describe("AtaPrognosisShowTableComponent", () => {
  let component: AtaPrognosisShowTableComponent;
  let fixture: ComponentFixture<AtaPrognosisShowTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AtaPrognosisShowTableComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AtaPrognosisShowTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
