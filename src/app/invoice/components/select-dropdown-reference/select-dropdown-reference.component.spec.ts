import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectDropdownReferenceComponent } from './select-dropdown-reference.component';

describe('SelectDropdownReferenceComponent', () => {
  let component: SelectDropdownReferenceComponent;
  let fixture: ComponentFixture<SelectDropdownReferenceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SelectDropdownReferenceComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SelectDropdownReferenceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
