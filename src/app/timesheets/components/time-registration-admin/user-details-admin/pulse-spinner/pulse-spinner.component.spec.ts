import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PulseSpinnerComponent } from './pulse-spinner.component';

describe('PulseSpinnerComponent', () => {
  let component: PulseSpinnerComponent;
  let fixture: ComponentFixture<PulseSpinnerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PulseSpinnerComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PulseSpinnerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
