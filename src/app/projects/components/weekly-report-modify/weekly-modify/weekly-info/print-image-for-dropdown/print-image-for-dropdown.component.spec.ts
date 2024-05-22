import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrintImageForDropdownComponent } from './print-image-for-dropdown.component';

describe('PrintImageForDropdownComponent', () => {
  let component: PrintImageForDropdownComponent;
  let fixture: ComponentFixture<PrintImageForDropdownComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PrintImageForDropdownComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PrintImageForDropdownComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
