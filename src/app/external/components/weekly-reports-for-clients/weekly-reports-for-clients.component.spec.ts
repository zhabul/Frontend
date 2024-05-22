import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WeeklyReportsForClientsComponent } from './weekly-reports-for-clients.component';

describe('WeeklyReportsForClientsComponent', () => {
  let component: WeeklyReportsForClientsComponent;
  let fixture: ComponentFixture<WeeklyReportsForClientsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WeeklyReportsForClientsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WeeklyReportsForClientsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
