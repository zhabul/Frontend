import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DocumentColletionDownloadComponent } from './document-colletion-download.component';

describe('DocumentColletionDownloadComponent', () => {
  let component: DocumentColletionDownloadComponent;
  let fixture: ComponentFixture<DocumentColletionDownloadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DocumentColletionDownloadComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DocumentColletionDownloadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
