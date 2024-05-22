import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientAttachmentsDetailsComponent } from './client-attachments-details.component';

describe('ClientAttachmentsDetailsComponent', () => {
  let component: ClientAttachmentsDetailsComponent;
  let fixture: ComponentFixture<ClientAttachmentsDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ClientAttachmentsDetailsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ClientAttachmentsDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
