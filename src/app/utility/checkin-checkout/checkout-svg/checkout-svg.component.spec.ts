import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CheckoutSvgComponent } from './checkout-svg.component';

describe('CheckoutSvgComponent', () => {
  let component: CheckoutSvgComponent;
  let fixture: ComponentFixture<CheckoutSvgComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CheckoutSvgComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CheckoutSvgComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
