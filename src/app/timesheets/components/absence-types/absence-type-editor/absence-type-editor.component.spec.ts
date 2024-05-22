import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AbsenceTypeEditorComponent } from './absence-type-editor.component';

describe('AbsenceTypeEditorComponent', () => {
  let component: AbsenceTypeEditorComponent;
  let fixture: ComponentFixture<AbsenceTypeEditorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AbsenceTypeEditorComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AbsenceTypeEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
