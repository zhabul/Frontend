import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AttestSelectDropdownComponent } from './attest-select-dropdown.component';

describe('AttestSelectDropdownComponent', () => {
  let component: AttestSelectDropdownComponent;
  let fixture: ComponentFixture<AttestSelectDropdownComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AttestSelectDropdownComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AttestSelectDropdownComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
