import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectDropdownWithPlusComponent } from './select-dropdown-with-plus.component';

describe('SelectDropdownWithPlusComponent', () => {
  let component: SelectDropdownWithPlusComponent;
  let fixture: ComponentFixture<SelectDropdownWithPlusComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SelectDropdownWithPlusComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SelectDropdownWithPlusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
