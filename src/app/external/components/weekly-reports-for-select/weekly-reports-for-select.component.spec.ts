import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WeeklyReportsForSelectComponent } from './weekly-reports-for-select.component';

describe('WeeklyReportsForSelectComponent', () => {
  let component: WeeklyReportsForSelectComponent;
  let fixture: ComponentFixture<WeeklyReportsForSelectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WeeklyReportsForSelectComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WeeklyReportsForSelectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
