import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormRoleDropdownComponent } from './form-role-dropdown.component';

describe('FormRoleDropdownComponent', () => {
  let component: FormRoleDropdownComponent;
  let fixture: ComponentFixture<FormRoleDropdownComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FormRoleDropdownComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FormRoleDropdownComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
