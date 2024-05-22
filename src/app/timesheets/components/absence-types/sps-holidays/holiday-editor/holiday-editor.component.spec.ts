import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HolidayEditorComponent } from './holiday-editor.component';

describe('HolidayEditorComponent', () => {
  let component: HolidayEditorComponent;
  let fixture: ComponentFixture<HolidayEditorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HolidayEditorComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HolidayEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
