import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserAbsenceStatsComponent } from './user-absence-stats.component';

describe('UserAbsenceStatsComponent', () => {
  let component: UserAbsenceStatsComponent;
  let fixture: ComponentFixture<UserAbsenceStatsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserAbsenceStatsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserAbsenceStatsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
