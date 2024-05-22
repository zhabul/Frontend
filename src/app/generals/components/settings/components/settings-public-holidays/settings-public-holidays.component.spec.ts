import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SettingsPublicHolidaysComponent } from './settings-public-holidays.component';

describe('SettingsPublicHolidaysComponent', () => {
  let component: SettingsPublicHolidaysComponent;
  let fixture: ComponentFixture<SettingsPublicHolidaysComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SettingsPublicHolidaysComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SettingsPublicHolidaysComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
