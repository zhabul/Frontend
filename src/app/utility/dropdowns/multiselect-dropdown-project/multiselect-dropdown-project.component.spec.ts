import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MultiselectDropdownProjectComponent } from './multiselect-dropdown-project.component';

describe('MultiselectDropdownProjectComponent', () => {
  let component: MultiselectDropdownProjectComponent;
  let fixture: ComponentFixture<MultiselectDropdownProjectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MultiselectDropdownProjectComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MultiselectDropdownProjectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
