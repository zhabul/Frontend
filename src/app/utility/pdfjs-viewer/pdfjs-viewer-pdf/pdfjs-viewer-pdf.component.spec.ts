import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PdfjsViewerPdfComponent } from './pdfjs-viewer-pdf.component';

describe('PdfjsViewerPdfComponent', () => {
  let component: PdfjsViewerPdfComponent;
  let fixture: ComponentFixture<PdfjsViewerPdfComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PdfjsViewerPdfComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PdfjsViewerPdfComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
