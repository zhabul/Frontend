import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StatsYearComponent } from './stats-year.component';

describe('StatsYearComponent', () => {
  let component: StatsYearComponent;
  let fixture: ComponentFixture<StatsYearComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StatsYearComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StatsYearComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
