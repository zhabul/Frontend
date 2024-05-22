import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SendPrintDropdownUTComponent } from './send-print-dropdown-ut.component';

describe('SendPrintDropdownUTComponent', () => {
  let component: SendPrintDropdownUTComponent;
  let fixture: ComponentFixture<SendPrintDropdownUTComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SendPrintDropdownUTComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SendPrintDropdownUTComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
