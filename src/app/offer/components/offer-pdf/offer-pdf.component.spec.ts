import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OfferPdfComponent } from './offer-pdf.component';

describe('OfferPdfComponent', () => {
  let component: OfferPdfComponent;
  let fixture: ComponentFixture<OfferPdfComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OfferPdfComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OfferPdfComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
