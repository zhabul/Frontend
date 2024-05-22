import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FileOfferPdfComponent } from './file-offer-pdf.component';

describe('FileOfferPdfComponent', () => {
  let component: FileOfferPdfComponent;
  let fixture: ComponentFixture<FileOfferPdfComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FileOfferPdfComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FileOfferPdfComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
