import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SalarySystemEditorComponent } from './salary-system-editor.component';

describe('SalarySystemEditorComponent', () => {
  let component: SalarySystemEditorComponent;
  let fixture: ComponentFixture<SalarySystemEditorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SalarySystemEditorComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SalarySystemEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
