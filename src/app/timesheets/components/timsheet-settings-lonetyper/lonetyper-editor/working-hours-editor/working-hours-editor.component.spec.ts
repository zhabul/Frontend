import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkingHoursEditorComponent } from './working-hours-editor.component';

describe('WorkingHoursEditorComponent', () => {
  let component: WorkingHoursEditorComponent;
  let fixture: ComponentFixture<WorkingHoursEditorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WorkingHoursEditorComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WorkingHoursEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
