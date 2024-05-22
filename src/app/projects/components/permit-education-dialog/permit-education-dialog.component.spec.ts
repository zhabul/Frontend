import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PermitEducationDialogComponent } from './permit-education-dialog.component';

describe('PermitEducationDialogComponent', () => {
  let component: PermitEducationDialogComponent;
  let fixture: ComponentFixture<PermitEducationDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PermitEducationDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PermitEducationDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
