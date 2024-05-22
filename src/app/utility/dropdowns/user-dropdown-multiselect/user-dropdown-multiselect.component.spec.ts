import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserDropdownMultiselectComponent } from './user-dropdown-multiselect.component';

describe('UserDropdownMultiselectComponent', () => {
  let component: UserDropdownMultiselectComponent;
  let fixture: ComponentFixture<UserDropdownMultiselectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserDropdownMultiselectComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserDropdownMultiselectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
