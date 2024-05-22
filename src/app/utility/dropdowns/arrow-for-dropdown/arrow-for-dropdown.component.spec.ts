import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArrowForDropdownComponent } from './arrow-for-dropdown.component';

describe('ArrowForDropdownComponent', () => {
  let component: ArrowForDropdownComponent;
  let fixture: ComponentFixture<ArrowForDropdownComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ArrowForDropdownComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ArrowForDropdownComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
