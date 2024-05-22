import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WeeklyInfoTabsComponent } from './weekly-info-tabs.component';

describe('WeeklyInfoTabsComponent', () => {
  let component: WeeklyInfoTabsComponent;
  let fixture: ComponentFixture<WeeklyInfoTabsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WeeklyInfoTabsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WeeklyInfoTabsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
