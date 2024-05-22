import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OfferRowComponent } from './offer-row.component';

describe('OfferRowComponent', () => {
  let component: OfferRowComponent;
  let fixture: ComponentFixture<OfferRowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OfferRowComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OfferRowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
