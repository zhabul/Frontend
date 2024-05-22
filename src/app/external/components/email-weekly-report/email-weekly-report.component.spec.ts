import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { EmailWeeklyReportComponent } from "./email-weekly-report.component";

describe("EmailWeeklyReportComponent", () => {
  let component: EmailWeeklyReportComponent;
  let fixture: ComponentFixture<EmailWeeklyReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [EmailWeeklyReportComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmailWeeklyReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
