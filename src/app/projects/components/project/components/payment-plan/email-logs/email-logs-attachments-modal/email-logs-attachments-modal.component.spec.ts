import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EmailLogsAttachmentsModalComponent } from './email-logs-attachments-modal.component';

describe('EmailLogsAttachmentsModalComponent', () => {
  let component: EmailLogsAttachmentsModalComponent;
  let fixture: ComponentFixture<EmailLogsAttachmentsModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EmailLogsAttachmentsModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmailLogsAttachmentsModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
