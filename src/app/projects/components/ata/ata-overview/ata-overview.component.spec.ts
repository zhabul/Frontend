import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { AtaOverviewComponent } from "./ata-overview.component";

describe("AtaOverviewComponent", () => {
  let component: AtaOverviewComponent;
  let fixture: ComponentFixture<AtaOverviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AtaOverviewComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AtaOverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
