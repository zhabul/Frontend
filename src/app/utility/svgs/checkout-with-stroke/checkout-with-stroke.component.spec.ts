import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CheckoutWithStrokeComponent } from './checkout-with-stroke.component';

describe('CheckoutWithStrokeComponent', () => {
  let component: CheckoutWithStrokeComponent;
  let fixture: ComponentFixture<CheckoutWithStrokeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CheckoutWithStrokeComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CheckoutWithStrokeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
