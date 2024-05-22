import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddCustomerContactComponent } from './add-customer-contact.component';

describe('AddCustomerContactComponent', () => {
  let component: AddCustomerContactComponent;
  let fixture: ComponentFixture<AddCustomerContactComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddCustomerContactComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddCustomerContactComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
