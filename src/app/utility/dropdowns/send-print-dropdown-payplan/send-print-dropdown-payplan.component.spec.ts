import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SendPrintDropdownPayplanComponent } from './send-print-dropdown-payplan.component';

describe('SendPrintDropdownPayplanComponent', () => {
  let component: SendPrintDropdownPayplanComponent;
  let fixture: ComponentFixture<SendPrintDropdownPayplanComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SendPrintDropdownPayplanComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SendPrintDropdownPayplanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
