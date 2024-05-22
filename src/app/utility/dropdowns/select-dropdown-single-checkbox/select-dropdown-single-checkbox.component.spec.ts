import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectDropdownSingleCheckboxComponent } from './select-dropdown-single-checkbox.component';

describe('SelectDropdownSingleCheckboxComponent', () => {
  let component: SelectDropdownSingleCheckboxComponent;
  let fixture: ComponentFixture<SelectDropdownSingleCheckboxComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SelectDropdownSingleCheckboxComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SelectDropdownSingleCheckboxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
