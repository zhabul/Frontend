import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SendPrintDropdownATAComponent } from './send-print-dropdown-ata.component';

describe('SendPrintDropdownATAComponent', () => {
  let component: SendPrintDropdownATAComponent;
  let fixture: ComponentFixture<SendPrintDropdownATAComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SendPrintDropdownATAComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SendPrintDropdownATAComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
