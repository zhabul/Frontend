import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SendImageForDropdownComponent } from './send-image-for-dropdown.component';

describe('SendImageForDropdownComponent', () => {
  let component: SendImageForDropdownComponent;
  let fixture: ComponentFixture<SendImageForDropdownComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SendImageForDropdownComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SendImageForDropdownComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
