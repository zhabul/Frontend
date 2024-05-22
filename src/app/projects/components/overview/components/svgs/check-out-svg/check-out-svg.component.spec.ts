import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CheckOutSvgComponent } from './check-out-svg.component';

describe('CheckOutSvgComponent', () => {
  let component: CheckOutSvgComponent;
  let fixture: ComponentFixture<CheckOutSvgComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CheckOutSvgComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CheckOutSvgComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
