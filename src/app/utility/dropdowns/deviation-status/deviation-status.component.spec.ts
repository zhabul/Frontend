import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeviationStatusComponent } from './deviation-status.component';

describe('DeviationStatusComponent', () => {
  let component: DeviationStatusComponent;
  let fixture: ComponentFixture<DeviationStatusComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DeviationStatusComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DeviationStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
