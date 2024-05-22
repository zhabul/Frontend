import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OfferClientResponseComponent } from './offer-client-response.component';

describe('OfferClientResponseComponent', () => {
  let component: OfferClientResponseComponent;
  let fixture: ComponentFixture<OfferClientResponseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OfferClientResponseComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OfferClientResponseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
