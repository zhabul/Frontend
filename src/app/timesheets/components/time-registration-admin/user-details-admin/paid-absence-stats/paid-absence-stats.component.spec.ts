import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaidAbsenceStatsComponent } from './paid-absence-stats.component';

describe('PaidAbsenceStatsComponent', () => {
  let component: PaidAbsenceStatsComponent;
  let fixture: ComponentFixture<PaidAbsenceStatsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PaidAbsenceStatsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PaidAbsenceStatsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
