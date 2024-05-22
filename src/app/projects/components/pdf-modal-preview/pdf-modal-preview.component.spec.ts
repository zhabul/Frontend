import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PdfModalPreviewComponent } from './pdf-modal-preview.component';

describe('PdfModalPreviewComponent', () => {
  let component: PdfModalPreviewComponent;
  let fixture: ComponentFixture<PdfModalPreviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PdfModalPreviewComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PdfModalPreviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
