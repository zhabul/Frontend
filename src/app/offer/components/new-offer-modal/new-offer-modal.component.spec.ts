import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewOfferModalComponent } from './new-offer-modal.component';

describe('NewOfferModalComponent', () => {
  let component: NewOfferModalComponent;
  let fixture: ComponentFixture<NewOfferModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NewOfferModalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NewOfferModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
