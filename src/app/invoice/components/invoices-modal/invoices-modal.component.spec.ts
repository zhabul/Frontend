import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InvoicesModalComponent } from './invoices-modal.component';

describe('InvoicesModalComponent', () => {
  let component: InvoicesModalComponent;
  let fixture: ComponentFixture<InvoicesModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InvoicesModalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InvoicesModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
