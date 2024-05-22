import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CheckOutAllSvgComponent } from './check-out-all-svg.component';

describe('CheckOutAllSvgComponent', () => {
  let component: CheckOutAllSvgComponent;
  let fixture: ComponentFixture<CheckOutAllSvgComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CheckOutAllSvgComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CheckOutAllSvgComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
