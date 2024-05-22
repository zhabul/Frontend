import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TimsheetSettingsLonetyperComponent } from './timsheet-settings-lonetyper.component';

describe('TimsheetSettingsLonetyperComponent', () => {
  let component: TimsheetSettingsLonetyperComponent;
  let fixture: ComponentFixture<TimsheetSettingsLonetyperComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TimsheetSettingsLonetyperComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TimsheetSettingsLonetyperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
