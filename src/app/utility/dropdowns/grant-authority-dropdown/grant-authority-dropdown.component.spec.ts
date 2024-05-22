import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GrantAuthorityDropdownComponent } from './grant-authority-dropdown.component';

describe('GrantAuthorityDropdownComponent', () => {
  let component: GrantAuthorityDropdownComponent;
  let fixture: ComponentFixture<GrantAuthorityDropdownComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GrantAuthorityDropdownComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GrantAuthorityDropdownComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
