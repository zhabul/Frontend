import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SpsWorkWeekComponent } from './sps-work-week.component';

describe('SpsWorkWeekComponent', () => {
  let component: SpsWorkWeekComponent;
  let fixture: ComponentFixture<SpsWorkWeekComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SpsWorkWeekComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SpsWorkWeekComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
