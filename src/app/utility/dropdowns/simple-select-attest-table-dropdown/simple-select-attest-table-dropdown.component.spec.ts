import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SimpleSelectAttestTableDropdownComponent } from './simple-select-attest-table-dropdown.component';

describe('SimpleSelectAttestTableDropdownComponent', () => {
  let component: SimpleSelectAttestTableDropdownComponent;
  let fixture: ComponentFixture<SimpleSelectAttestTableDropdownComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SimpleSelectAttestTableDropdownComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SimpleSelectAttestTableDropdownComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
