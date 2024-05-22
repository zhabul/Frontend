import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddingContactSupplierComponent } from './adding-contact-supplier.component';

describe('AddingContactSupplierComponent', () => {
  let component: AddingContactSupplierComponent;
  let fixture: ComponentFixture<AddingContactSupplierComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddingContactSupplierComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddingContactSupplierComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
