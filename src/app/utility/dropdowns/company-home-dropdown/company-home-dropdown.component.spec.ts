import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompanyHomeDropdownComponent } from './company-home-dropdown.component';

describe('CompanyHomeDropdownComponent', () => {
  let component: CompanyHomeDropdownComponent;
  let fixture: ComponentFixture<CompanyHomeDropdownComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CompanyHomeDropdownComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CompanyHomeDropdownComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
