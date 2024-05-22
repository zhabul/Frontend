import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArrowForFirstDropdownComponent } from './arrow-for-first-dropdown.component';

describe('ArrowForFirstDropdownComponent', () => {
  let component: ArrowForFirstDropdownComponent;
  let fixture: ComponentFixture<ArrowForFirstDropdownComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ArrowForFirstDropdownComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ArrowForFirstDropdownComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
